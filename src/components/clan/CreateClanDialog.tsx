import React, { useState } from 'react';
import { X } from 'lucide-react';

interface CreateClanDialogProps {
  trigger?: React.ReactNode;
}

export const CreateClanDialog: React.FC<CreateClanDialogProps> = ({ trigger }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    clanName: '',
    clanAlias: '',
    description: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Creating clan:', formData);
    setIsOpen(false);
    setFormData({ clanName: '', clanAlias: '', description: '' });
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center justify-center px-4 py-2 bg-primary text-dark-bg font-semibold rounded-lg hover:bg-primary/90 transition-all"
      >
        {trigger ? trigger : '+ Create Clan'}
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-dark-card border border-white/10 rounded-2xl p-8 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Create Clan</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-text hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-text mb-2">Clan Name</label>
                <input
                  type="text"
                  name="clanName"
                  value={formData.clanName}
                  onChange={handleChange}
                  placeholder="Enter clan name"
                  className="w-full bg-dark-bg border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-gray-muted focus:outline-none focus:border-primary/30 focus:ring-1 focus:ring-primary/20 transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-text mb-2">Clan Alias</label>
                <input
                  type="text"
                  name="clanAlias"
                  value={formData.clanAlias}
                  onChange={handleChange}
                  placeholder="Short alias (no spaces)"
                  className="w-full bg-dark-bg border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-gray-muted focus:outline-none focus:border-primary/30 focus:ring-1 focus:ring-primary/20 transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-text mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Tell us about your clan"
                  rows={3}
                  className="w-full bg-dark-bg border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-gray-muted focus:outline-none focus:border-primary/30 focus:ring-1 focus:ring-primary/20 transition-all resize-none"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 px-4 py-2.5 border border-white/10 text-white rounded-lg hover:bg-white/5 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-primary text-dark-bg font-semibold rounded-lg hover:bg-primary/90 transition-all"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
