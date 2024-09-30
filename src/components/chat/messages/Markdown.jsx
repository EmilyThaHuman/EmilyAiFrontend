// import React from "react";
// import ReactMarkdown from "react-markdown";
// import remarkGfm from "remark-gfm";
// import { motion } from "framer-motion";

// export const NonMemoizedMarkdown = ({ children }: { children: string }) => {
//   const components = {
//     code: ({ node, inline, className, children, ...props }: any) => {
//       const match = /language-(\w+)/.exec(className || "");
//       return !inline && match ? (
//         <pre
//           {...props}
//           className={`${className} text-sm w-[80dvw] md:max-w-[500px] overflow-x-scroll bg-zinc-100 p-2 rounded mt-2 dark:bg-zinc-800`}
//         >
//           <code className={match[1]}>{children}</code>
//         </pre>
//       ) : (
//         <code
//           className={`${className} text-sm bg-zinc-100 dark:bg-zinc-800 py-0.5 px-1 rounded`}
//           {...props}
//         >
//           {children}
//         </code>
//       );
//     },
//     ol: ({ node, children, ...props }: any) => {
//       return (
//         <ol className="list-decimal list-inside ml-4" {...props}>
//           {children}
//         </ol>
//       );
//     },
//     li: ({ node, children, ...props }: any) => {
//       return (
//         <li className="py-1" {...props}>
//           {children}
//         </li>
//       );
//     },
//     ul: ({ node, children, ...props }: any) => {
//       return (
//         <ul className="list-decimal list-inside ml-4" {...props}>
//           {children}
//         </ul>
//       );
//     },
//     strong: ({ node, children, ...props }: any) => {
//       return (
//         <span className="font-semibold" {...props}>
//           {children}
//         </span>
//       );
//     },
//   };

//   return (
//     <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
//       {children}
//     </ReactMarkdown>
//   );
// };

// export const Markdown = React.memo(
//   NonMemoizedMarkdown,
//   (prevProps, nextProps) => prevProps.children === nextProps.children,
// );

// "use client";

// // import { motion } from "framer-motion";
// // import { BotIcon, UserIcon } from "./icons";
// // import { ReactNode } from "react";
// // import { StreamableValue, useStreamableValue } from "ai/rsc";

// export const TextStreamMessage = ({
//   content,
// }: {
//   content: StreamableValue;
// }) => {
//   const [text] = useStreamableValue(content);

//   return (
//     <motion.div
//       className={`flex flex-row gap-4 px-4 w-full md:w-[500px] md:px-0 first-of-type:pt-20`}
//       initial={{ y: 5, opacity: 0 }}
//       animate={{ y: 0, opacity: 1 }}
//     >
//       <div className="size-[24px] flex flex-col justify-center items-center flex-shrink-0 text-zinc-400">
//         <BotIcon />
//       </div>

//       <div className="flex flex-col gap-1 w-full">
//         <div className="text-zinc-800 dark:text-zinc-300 flex flex-col gap-4">
//           <Markdown>{text}</Markdown>
//         </div>
//       </div>
//     </motion.div>
//   );
// };
