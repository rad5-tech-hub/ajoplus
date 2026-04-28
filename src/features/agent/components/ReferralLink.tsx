// // src/features/agent/dashboard/components/ReferralLink.tsx
// import { useState } from 'react';
// import { Link as LinkIcon, Copy, Share2, Check } from 'lucide-react';
// import { useQuery } from '@tanstack/react-query';
// import { getAgentDashboard } from '@/api/agent';
// import { useModalStore } from '@/app/store/ModalStore';

// const ReferralLink = () => {
//   const [copied, setCopied] = useState(false);
//   const { openModal } = useModalStore.getState();

//   const { data, isLoading, error } = useQuery({
//     queryKey: ['agentDashboard'],
//     queryFn: getAgentDashboard,
//     staleTime: 5 * 60 * 1000,
//     retry: 2,
//   });

//   const referralLink = data?.referral?.link ?? '';

//   const copyLink = async () => {
//     if (!referralLink) return;

//     try {
//       await navigator.clipboard.writeText(referralLink);
//       setCopied(true);
//       setTimeout(() => setCopied(false), 2000);

//       openModal({
//         type: 'success',
//         message: 'Referral link copied successfully!',
//       });
//     } catch {
//       openModal({
//         type: 'error',
//         message: 'Failed to copy link. Please try again.',
//       });
//     }
//   };

//   const shareLink = async () => {
//     if (!referralLink) return;

//     try {
//       if (navigator.share) {
//         await navigator.share({
//           title: 'Join AjoPlus with me!',
//           text: 'Sign up using my referral link and start saving today.',
//           url: referralLink,
//         });
//         openModal({ type: 'success', message: 'Shared successfully!' });
//       } else {
//         await navigator.clipboard.writeText(referralLink);
//         setCopied(true);
//         setTimeout(() => setCopied(false), 2000);
//         openModal({ type: 'success', message: 'Link copied to clipboard!' });
//       }
//     } catch {
//       openModal({
//         type: 'error',
//         message: 'Failed to share link.',
//       });
//     }
//   };

//   if (error) {
//     return (
//       <div className="bg-white border border-red-200 rounded-2xl p-6 text-center">
//         <p className="text-red-600 text-sm">Failed to load referral link</p>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-emerald-600 text-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 lg:p-8">
//       <div className="flex items-center gap-2.5 sm:gap-3 mb-4 sm:mb-5 lg:mb-6">
//         <LinkIcon className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" />
//         <h3 className="text-base sm:text-lg lg:text-xl font-semibold">Your Referral Link</h3>
//       </div>

//       <p className="text-emerald-100 text-sm sm:text-[15px] leading-relaxed mb-4 sm:mb-5 lg:mb-6">
//         Share this link with friends and family. You earn{' '}
//         <span className="font-semibold text-white">₦4,000</span> for every person
//         who signs up and buys a package!
//       </p>

//       {/* URL box */}
//       <div className="bg-white/15 rounded-xl sm:rounded-2xl p-3 sm:p-4 mb-4 sm:mb-5 lg:mb-6">
//         <p className="text-[10px] sm:text-xs text-emerald-200 uppercase tracking-wide mb-1">
//           Referral URL
//         </p>
//         {isLoading ? (
//           <div className="h-4 w-3/4 bg-white/20 rounded-full animate-pulse mt-1" />
//         ) : (
//           <p className="font-mono text-xs sm:text-sm break-all leading-relaxed">
//             {referralLink || 'https://ajoplus.com/ref/••••••••'}
//           </p>
//         )}
//       </div>

//       <div className="grid grid-cols-2 gap-3 sm:gap-4">
//         <button
//           onClick={copyLink}
//           disabled={isLoading || !referralLink}
//           className="bg-emerald-950 hover:bg-black active:scale-95 disabled:opacity-50 disabled:pointer-events-none cursor-pointer text-white py-3 sm:py-3.5 lg:py-4 px-3 rounded-xl sm:rounded-2xl text-sm sm:text-[15px] font-semibold flex items-center justify-center gap-2 transition-all"
//         >
//           {copied ? (
//             <>
//               <Check className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" /> Copied!
//             </>
//           ) : (
//             <>
//               <Copy className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" /> Copy Link
//             </>
//           )}
//         </button>

//         <button
//           onClick={shareLink}
//           disabled={isLoading || !referralLink}
//           className="bg-emerald-950 hover:bg-black active:scale-95 disabled:opacity-50 disabled:pointer-events-none cursor-pointer text-white py-3 sm:py-3.5 lg:py-4 px-3 rounded-xl sm:rounded-2xl text-sm sm:text-[15px] font-semibold flex items-center justify-center gap-2 transition-all"
//         >
//           <Share2 className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
//           Share Link
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ReferralLink;