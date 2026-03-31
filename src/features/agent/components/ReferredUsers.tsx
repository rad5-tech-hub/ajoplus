// src/features/agent/dashboard/components/ReferredUsers.tsx
const users = [
  { name: 'Chioma Okafor',    email: 'chioma.o@email.com',  packages: 2, earnings: '₦8,000',  joined: '20 Sept 2025' },
  { name: 'Emeka Nwosu',      email: 'emeka.n@email.com',   packages: 1, earnings: '₦4,000',  joined: '5 Oct 2025'  },
  { name: 'Fatima Bello',     email: 'fatima.b@email.com',  packages: 3, earnings: '₦12,000', joined: '12 Nov 2025' },
  { name: 'Oluwaseun Adeleke',email: 'seun.a@email.com',    packages: 2, earnings: '₦8,000',  joined: '1 Dec 2025'  },
  { name: 'Blessing Eze',     email: 'blessing.e@email.com',packages: 1, earnings: '₦4,000',  joined: '10 Jan 2026' },
];

function getInitials(name: string) {
  return name.split(' ').map((p) => p[0]).join('').slice(0, 2);
}

const ReferredUsers = () => {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-5 sm:mb-6 lg:mb-8">
        <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-slate-900">
          Referred Users
        </h3>
        <span className="text-xs sm:text-sm text-slate-400">
          {users.length} total
        </span>
      </div>

      <div className="space-y-0">
        {users.map((user, i) => (
          <div
            key={i}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between
                       gap-3 py-3.5 sm:py-4
                       border-b border-slate-100 last:border-b-0 last:pb-0"
          >
            {/* Avatar + name */}
            <div className="flex items-center gap-3 sm:gap-4 min-w-0">
              <div className="w-9 h-9 sm:w-10 sm:h-10 bg-emerald-100 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0 text-emerald-700 text-xs font-bold">
                {getInitials(user.name)}
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-slate-900 text-sm sm:text-base truncate">
                  {user.name}
                </p>
                <p className="text-xs sm:text-sm text-slate-400 truncate">{user.email}</p>
              </div>
            </div>

            {/* Stats — pill row on mobile, grid on desktop */}
            <div className="grid grid-cols-3 sm:flex sm:gap-6 lg:gap-8
                            bg-slate-50 sm:bg-transparent
                            rounded-xl sm:rounded-none
                            px-3 py-2 sm:p-0
                            text-xs sm:text-sm shrink-0">
              <div className="sm:text-right">
                <p className="text-slate-400 text-[10px] sm:text-xs">Packages</p>
                <p className="font-medium text-slate-900 mt-0.5">{user.packages}</p>
              </div>
              <div className="sm:text-right">
                <p className="text-slate-400 text-[10px] sm:text-xs">Earnings</p>
                <p className="font-semibold text-emerald-600 mt-0.5">{user.earnings}</p>
              </div>
              <div className="sm:text-right">
                <p className="text-slate-400 text-[10px] sm:text-xs">Joined</p>
                <p className="font-medium text-slate-900 mt-0.5 whitespace-nowrap">{user.joined}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReferredUsers;