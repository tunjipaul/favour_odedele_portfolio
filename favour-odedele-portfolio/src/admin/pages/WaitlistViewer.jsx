import { useEffect, useState } from 'react';
import { api } from '../utils/api';
import { Mail, User, Clock } from 'lucide-react';

export default function WaitlistViewer() {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    api.get('/admin/waitlist').then(setEntries).catch(console.error);
  }, []);

  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <h2 className="text-2xl font-extrabold text-gray-800 mb-1">Waitlist</h2>
      <p className="text-gray-500 text-sm mb-6">{entries.length} signups for <em>Success Leaves Cues</em></p>

      {entries.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12 text-center text-gray-400">
          <Mail className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p>No waitlist entries yet</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">#</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Name</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Email</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {entries.map((entry, i) => (
                <tr key={entry._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-400">{i + 1}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <User className="w-3.5 h-3.5 text-gray-300" />
                      <span className="text-gray-700">{entry.name || '—'}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-gray-300" />
                      <a href={`mailto:${entry.email}`} className="text-[#064E3B] hover:underline">{entry.email}</a>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 text-gray-400">
                      <Clock className="w-3.5 h-3.5" />
                      {formatDate(entry.createdAt)}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
