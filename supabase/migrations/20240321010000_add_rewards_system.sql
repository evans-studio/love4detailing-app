-- Create rewards tables safely
DO $$
BEGIN
  -- Create rewards table if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_name = 'rewards'
  ) THEN
    CREATE TABLE rewards (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
      points INTEGER NOT NULL DEFAULT 0,
      total_saved DECIMAL(10,2) NOT NULL DEFAULT 0,
      created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
      updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
    );

    -- Create index on user_id
    CREATE INDEX idx_rewards_user_id ON rewards(user_id);

    -- Enable RLS
    ALTER TABLE rewards ENABLE ROW LEVEL SECURITY;

    -- Create policies
    CREATE POLICY "Users can view their own rewards"
      ON rewards FOR SELECT
      USING (auth.uid() = user_id);

    CREATE POLICY "Users can update their own rewards"
      ON rewards FOR UPDATE
      USING (auth.uid() = user_id);
  END IF;

  -- Create reward_transactions table if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_name = 'reward_transactions'
  ) THEN
    CREATE TABLE reward_transactions (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      reward_id UUID REFERENCES rewards(id) ON DELETE CASCADE,
      booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
      points_change INTEGER NOT NULL,
      transaction_type TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
    );

    -- Create indexes
    CREATE INDEX idx_reward_transactions_reward_id ON reward_transactions(reward_id);
    CREATE INDEX idx_reward_transactions_booking_id ON reward_transactions(booking_id);

    -- Enable RLS
    ALTER TABLE reward_transactions ENABLE ROW LEVEL SECURITY;

    -- Create policies
    CREATE POLICY "Users can view their own reward transactions"
      ON reward_transactions FOR SELECT
      USING (
        reward_id IN (
          SELECT id FROM rewards WHERE user_id = auth.uid()
        )
      );
  END IF;

  -- Create rewards_history table if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_name = 'rewards_history'
  ) THEN
    CREATE TABLE rewards_history (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
      booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
      points INTEGER NOT NULL,
      type TEXT NOT NULL CHECK (type IN ('earned', 'redeemed')),
      description TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
    );

    -- Create indexes
    CREATE INDEX idx_rewards_history_user_id ON rewards_history(user_id);
    CREATE INDEX idx_rewards_history_booking_id ON rewards_history(booking_id);

    -- Enable RLS
    ALTER TABLE rewards_history ENABLE ROW LEVEL SECURITY;

    -- Create policies
    CREATE POLICY "Users can view their own rewards history"
      ON rewards_history FOR SELECT
      USING (auth.uid() = user_id);

    -- Create policy for system inserts
    CREATE POLICY "System can insert rewards history"
      ON rewards_history FOR INSERT
      WITH CHECK (true);
  END IF;

  -- Add rewards_points column to bookings table if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'bookings' AND column_name = 'rewards_points'
  ) THEN
    ALTER TABLE bookings
    ADD COLUMN rewards_points INTEGER DEFAULT 0;
  END IF;

  -- Add comments
  COMMENT ON TABLE rewards IS 'Stores user reward points and total savings';
  COMMENT ON TABLE reward_transactions IS 'Tracks all reward point transactions';
  COMMENT ON TABLE rewards_history IS 'Historical record of reward point transactions';
  COMMENT ON COLUMN bookings.rewards_points IS 'Points earned or redeemed for this booking';
END $$;

-- Create function to update rewards on booking completion
CREATE OR REPLACE FUNCTION update_rewards_on_booking_completion()
RETURNS TRIGGER AS $$
BEGIN
  -- Only process completed bookings
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    -- Calculate points (1 point per £1 spent)
    NEW.rewards_points = FLOOR(NEW.total_amount);
    
    -- Update user's rewards
    UPDATE rewards
    SET points = points + NEW.rewards_points,
        updated_at = NOW()
    WHERE user_id = NEW.user_id;
    
    -- Record the transaction
    INSERT INTO rewards_history (
      user_id,
      booking_id,
      points,
      type,
      description
    ) VALUES (
      NEW.user_id,
      NEW.id,
      NEW.rewards_points,
      'earned',
      'Points earned from booking #' || NEW.id
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for booking completion if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_rewards_on_booking_completion_trigger'
  ) THEN
    CREATE TRIGGER update_rewards_on_booking_completion_trigger
      BEFORE UPDATE ON bookings
      FOR EACH ROW
      EXECUTE FUNCTION update_rewards_on_booking_completion();
  END IF;
END $$;

-- Comments
comment on table rewards is 'Stores user reward points and savings';
comment on table rewards_history is 'Tracks all reward point transactions';
comment on column rewards.points is 'Current available points balance';
comment on column rewards.total_saved is 'Total amount saved through reward redemptions';
comment on column rewards_history.type is 'Type of transaction: earned or redeemed';
comment on column bookings.rewards_points is 'Points earned from this booking'; 