//  import { useState } from "react";
// import { FileUpload } from "../file-upload";

// export const BulkUpload = () => {
//   const [fileUrl, setFileUrl] = useState<string>("");

//   return (
//     <div className="flex items-center space-x-2">
//       <FileUpload
//         endpoint="excelFile"
//         onFileUpload={(url) => {
//           setFileUrl(url); // Update the uploaded file URL state
//           console.log("Uploaded file URL:", url);
//         }}
//       />
//       {fileUrl && (
//         <div className="text-sm text-gray-500">Uploaded file: {fileUrl}</div>
//       )}
//     </div>
//   );
// };
