'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, CheckCircle, AlertCircle, Trash2, ExternalLink } from 'lucide-react';

const formSchema = z.object({
  apiEndpoint: z
    .string()
    .url('Please enter a valid full URL')
    .min(30, 'URL is too short – it should include your Zoho Function path and zapikey')
    .refine(
      (url) => url.includes('zohoapis') && url.includes('/functions/') && url.includes('zapikey='),
      'Must be a valid Zoho Function execute URL with zapikey (example: https://www.zohoapis.com/crm/v7/functions/...&zapikey=...)'
    ),
});

type FormValues = z.infer<typeof formSchema>;

export default function ZohoIntegrationPage() {
  const [loading, setLoading] = useState(false);
  const [testLoading, setTestLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      apiEndpoint: '',
    },
  });

  const onSubmit = async (values: FormValues) => {
    setLoading(true);
    setStatus('idle');
    setMessage('');

    try {
      const res = await fetch('/api/zoho', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to save Zoho endpoint');
      }

      setStatus('success');
      setMessage('Zoho endpoint saved! Scanned cards will now be sent directly to it.');
      setIsConnected(true);
    } catch (err: any) {
      setStatus('error');
      setMessage(err.message || 'Failed to save endpoint');
    } finally {
      setLoading(false);
    }
  };

  const handleTestConnection = async () => {
    setTestLoading(true);
    setStatus('idle');
    setMessage('');

    try {
      const res = await fetch('/api/zoho/test', { method: 'POST' });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Test failed');

      setStatus('success');
      setMessage('Endpoint test successful – ready to receive data');
    } catch (err: any) {
      setStatus('error');
      setMessage(err.message || 'Test failed – check your URL');
    } finally {
      setTestLoading(false);
    }
  };

  const handleDisconnect = () => {
    if (!confirm('Remove this Zoho endpoint?')) return;
    setIsConnected(false);
    form.reset();
    setMessage('Endpoint removed');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-purple-900/20 py-12 px-4 md:px-6 transition-all duration-500">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-[#2d2a4a] dark:text-white">
          Zoho Direct Function Integration
        </h1>
        <p className="text-[#5a5570] dark:text-gray-400 mb-10 leading-relaxed text-base">
          Paste your Zoho Function execute URL below (the full link that includes your{' '}
          <code className="text-sm bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded font-mono">
            zapikey
          </code>
          ).
          <br />
          All scanned business cards will be sent directly to this URL.
        </p>

        <div className="bg-white dark:bg-gray-800/90 border border-[#e5e2f0] dark:border-gray-700 rounded-xl shadow-sm overflow-hidden backdrop-blur-sm">
          {/* Status Bar */}
          <div className="p-6 border-b border-[#e5e2f0] dark:border-gray-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-[#2d2a4a] dark:text-white">
                Integration Status
              </h2>
              <p className="text-sm text-[#5a5570] dark:text-gray-400 mt-1">
                Direct POST to your Zoho Function
              </p>
            </div>
            {isConnected ? (
              <span className="px-4 py-1.5 bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300 rounded-full text-sm font-medium flex items-center gap-2 whitespace-nowrap">
                <CheckCircle className="h-4 w-4" /> Connected
              </span>
            ) : (
              <span className="px-4 py-1.5 bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 rounded-full text-sm font-medium flex items-center gap-2 whitespace-nowrap">
                <AlertCircle className="h-4 w-4" /> Not Connected
              </span>
            )}
          </div>

          <div className="p-6 md:p-8 space-y-10">
            {/* Instructions Card */}
            <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-6 text-sm">
              <h3 className="font-bold text-blue-900 dark:text-blue-300 mb-5 text-lg flex items-center gap-2">
                <ExternalLink className="h-5 w-5" />
                How to Get Your Zoho Function Execute URL
              </h3>

              <ol className="list-decimal pl-6 space-y-4 text-gray-800 dark:text-gray-300">
                <li>
                  Log in to <strong>Zoho CRM</strong> or <strong>Zoho Developer Console</strong>
                </li>
                <li>
                  Go to <strong>Functions</strong> → open your function named{' '}
                  <strong>cardscannerforrealestate</strong> (or whatever you created)
                </li>
                <li>
                  Click <strong>Execute</strong> or look for the <strong>API Endpoint</strong> section
                </li>
                <li>
                  Copy the full URL — it should look exactly like this:
                  <code className="block mt-2 bg-blue-100 dark:bg-blue-950/50 p-3 rounded text-blue-800 dark:text-blue-300 font-mono text-xs break-all">
                    https://www.zohoapis.com/crm/v7/functions/cardscannerforrealestate/actions/execute?auth_type=apikey&zapikey=1003.54049d87e2be729c5864458c7468a3e9.32e930cd0544f7d0098b658853f82a78
                  </code>
                </li>
                <li>
                  Paste it into the field below → click <strong>Save Endpoint</strong> →{' '}
                  <strong>Test</strong>
                </li>
              </ol>

              <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg text-amber-800 dark:text-amber-300">
                <strong>Important:</strong> The URL must already include{' '}
                <code className="bg-amber-100 dark:bg-amber-900/40 px-1.5 py-0.5 rounded font-mono">
                  auth_type=apikey&zapikey=...
                </code>
                .<br />
                Do NOT enter a URL without the zapikey — it will fail.
              </div>
            </div>

            {/* Form */}
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Zoho Function Execute URL <span className="text-red-500">*</span>
                </label>
                <input
                  {...form.register('apiEndpoint')}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
                  placeholder="https://www.zohoapis.com/crm/v7/functions/.../execute?auth_type=apikey&zapikey=..."
                />
                {form.formState.errors.apiEndpoint && (
                  <p className="text-red-600 dark:text-red-400 text-sm mt-1">
                    {form.formState.errors.apiEndpoint.message}
                  </p>
                )}
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Paste the full URL including ?auth_type=apikey&zapikey=...
                </p>
              </div>

              {/* Status Message */}
              {message && (
                <div
                  className={`p-4 rounded-lg border flex items-center gap-3 ${
                    status === 'success'
                      ? 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800 text-green-800 dark:text-green-300'
                      : 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800 text-red-800 dark:text-red-300'
                  }`}
                >
                  {status === 'success' ? (
                    <CheckCircle className="h-5 w-5 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="h-5 w-5 flex-shrink-0" />
                  )}
                  <span>{message}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-gradient-to-r from-[#483d73] to-[#352c55]  text-whitefont-medium px-10 py-3 rounded-lg disabled:opacity-50 flex items-center justify-center gap-2 flex-1 transition-colors shadow-sm"
                >
                  {loading && <Loader2 className="h-5 w-5 animate-spin" />}
                  Save Endpoint
                </button>

                <button
                  type="button"
                  onClick={handleTestConnection}
                  disabled={testLoading || loading || !form.watch('apiEndpoint')}
                  className="border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 px-10 py-3 rounded-lg disabled:opacity-50 flex items-center justify-center gap-2 flex-1 transition-colors"
                >
                  {testLoading && <Loader2 className="h-5 w-5 animate-spin" />}
                  Test Endpoint
                </button>

                {isConnected && (
                  <button
                    type="button"
                    onClick={handleDisconnect}
                    className="border border-red-300 dark:border-red-600 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 px-10 py-3 rounded-lg flex items-center justify-center gap-2 flex-1 transition-colors"
                  >
                    <Trash2 className="h-5 w-5" />
                    Remove Endpoint
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}