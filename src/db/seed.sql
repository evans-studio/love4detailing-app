-- Insert services
INSERT INTO services (type, name, description, features, base_price) VALUES
  (
    'basic-wash',
    'Basic Wash',
    'Essential car cleaning service',
    '[
      "Exterior wash & dry",
      "Interior vacuum",
      "Dashboard clean",
      "Window clean",
      "Tire shine"
    ]'::jsonb,
    '{
      "small": 49.99,
      "medium": 59.99,
      "large": 69.99,
      "van": 79.99
    }'::jsonb
  ),
  (
    'full-valet',
    'Full Valet',
    'Comprehensive cleaning inside and out',
    '[
      "All Basic Wash features",
      "Interior deep clean",
      "Leather/upholstery clean",
      "Paint decontamination",
      "Wheel deep clean",
      "Wax protection"
    ]'::jsonb,
    '{
      "small": 99.99,
      "medium": 119.99,
      "large": 139.99,
      "van": 159.99
    }'::jsonb
  ),
  (
    'premium-detail',
    'Premium Detail',
    'Professional detailing service',
    '[
      "All Full Valet features",
      "Paint correction",
      "Ceramic coating",
      "Engine bay clean",
      "Glass polish",
      "Paint sealant"
    ]'::jsonb,
    '{
      "small": 199.99,
      "medium": 249.99,
      "large": 299.99,
      "van": 349.99
    }'::jsonb
  );

-- Insert add-ons
INSERT INTO add_ons (name, description, price) VALUES
  (
    'Paint Protection',
    'Long-lasting paint protection coating',
    '{
      "small": 49.99,
      "medium": 59.99,
      "large": 69.99,
      "van": 79.99
    }'::jsonb
  ),
  (
    'Interior Protection',
    'Fabric and leather protection treatment',
    '{
      "small": 39.99,
      "medium": 49.99,
      "large": 59.99,
      "van": 69.99
    }'::jsonb
  ),
  (
    'Wheel Protection',
    'Ceramic wheel coating for lasting shine',
    '{
      "small": 29.99,
      "medium": 39.99,
      "large": 49.99,
      "van": 59.99
    }'::jsonb
  ); 