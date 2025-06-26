import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { event } from '@/lib/analytics';

const feedbackSchema = z.object({
  deviceType: z.enum(['mobile', 'tablet', 'desktop']),
  browser: z.string().min(1, 'Please specify your browser'),
  pageUrl: z.string().url('Please enter a valid URL'),
  rating: z.number().min(1).max(5),
  usabilityIssues: z.array(z.string()).optional(),
  comments: z.string().optional(),
});

type FeedbackFormData = z.infer<typeof feedbackSchema>;

export function UserFeedbackForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm<FeedbackFormData>({
    resolver: zodResolver(feedbackSchema),
  });

  const onSubmit = async (data: FeedbackFormData) => {
    try {
      // Track feedback submission
      event({
        action: 'submit_feedback',
        category: 'User Testing',
        label: data.pageUrl,
        value: data.rating,
      });

      // Here you would typically send this to your backend
      console.log('Feedback submitted:', data);
      
      setIsSubmitted(true);
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
  };

  if (isSubmitted) {
    return (
      <div className="p-4 bg-green-50 rounded-lg">
        <p className="text-green-800">Thank you for your feedback!</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-gray-900">Help Us Improve</h2>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">Device Type</label>
        <select
          {...register('deviceType')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
        >
          <option value="mobile">Mobile</option>
          <option value="tablet">Tablet</option>
          <option value="desktop">Desktop</option>
        </select>
        {errors.deviceType && (
          <p className="mt-1 text-sm text-red-600">{errors.deviceType.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Browser</label>
        <input
          type="text"
          {...register('browser')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
          placeholder="e.g., Chrome, Safari, Firefox"
        />
        {errors.browser && (
          <p className="mt-1 text-sm text-red-600">{errors.browser.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Page URL</label>
        <input
          type="url"
          {...register('pageUrl')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
          defaultValue={typeof window !== 'undefined' ? window.location.href : ''}
        />
        {errors.pageUrl && (
          <p className="mt-1 text-sm text-red-600">{errors.pageUrl.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Rating (1-5)</label>
        <input
          type="number"
          min="1"
          max="5"
          {...register('rating', { valueAsNumber: true })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
        />
        {errors.rating && (
          <p className="mt-1 text-sm text-red-600">{errors.rating.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Usability Issues</label>
        <div className="mt-2 space-y-2">
          {['Layout', 'Navigation', 'Performance', 'Touch targets', 'Text readability'].map((issue) => (
            <label key={issue} className="inline-flex items-center mr-4">
              <input
                type="checkbox"
                value={issue}
                {...register('usabilityIssues')}
                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <span className="ml-2">{issue}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Additional Comments</label>
        <textarea
          {...register('comments')}
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
          placeholder="Please share any specific issues or suggestions..."
        />
      </div>

      <button
        type="submit"
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
      >
        Submit Feedback
      </button>
    </form>
  );
} 