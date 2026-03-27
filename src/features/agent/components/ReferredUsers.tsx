// src/features/agent/dashboard/components/ReferredUsers.tsx
const ReferredUsers = () => {
  const users = [
    {
      name: "Chioma Okafor",
      email: "chioma.o@email.com",
      packages: 2,
      earnings: "₦8,000",
      joined: "20 Sept 2025",
    },
    {
      name: "Emeka Nwosu",
      email: "emeka.n@email.com",
      packages: 1,
      earnings: "₦4,000",
      joined: "5 Oct 2025",
    },
    {
      name: "Fatima Bello",
      email: "fatima.b@email.com",
      packages: 3,
      earnings: "₦12,000",
      joined: "12 Nov 2025",
    },
    {
      name: "Oluwaseun Adeleke",
      email: "seun.a@email.com",
      packages: 2,
      earnings: "₦8,000",
      joined: "1 Dec 2025",
    },
    {
      name: "Blessing Eze",
      email: "blessing.e@email.com",
      packages: 1,
      earnings: "₦4,000",
      joined: "10 Jan 2026",
    },
  ];

  return (
    <div className="bg-white border border-slate-100 rounded-3xl p-8">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-2xl font-semibold text-slate-900">Referred Users</h3>
        <span className="text-sm text-slate-500">5 total</span>
      </div>

      <div className="space-y-5">
        {users.map((user, index) => (
          <div key={index} className="flex items-center justify-between py-4 border-b border-slate-100 last:border-b-0">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-emerald-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                👤
              </div>
              <div>
                <p className="font-semibold text-slate-900">{user.name}</p>
                <p className="text-sm text-slate-500">{user.email}</p>
              </div>
            </div>

            <div className="text-right text-sm">
              <div className="grid grid-cols-3 gap-x-8">
                <div>
                  <p className="text-slate-500">Packages</p>
                  <p className="font-medium">{user.packages}</p>
                </div>
                <div>
                  <p className="text-slate-500">Earnings</p>
                  <p className="font-semibold text-emerald-600">{user.earnings}</p>
                </div>
                <div>
                  <p className="text-slate-500">Joined</p>
                  <p className="font-medium">{user.joined}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReferredUsers;