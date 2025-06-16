// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { createClient } from "@/utils/supabase/server";
// import FormsTable from "./forms-table";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// export default async function DepartmentFormsPage() {
//   const supabase = await createClient();
//   const {
//     data: { user },
//     error: authError,
//   } = await supabase.auth.getUser()

//   const { data: forms, error } = await supabase.from("forms").select(`*, users(*), subjects(*, departments(*, institutes(*)))`);

//   if (error) {
//     console.error("Error fetching forms:", error);
//     return <div>Error loading forms. Please try again later.</div>;
//   } else {
//     console.log("Fetched forms:", forms[0]);
//   }
  
//   let userData = null;
//   let userError = null;

//   if (user) {
//     const { data, error } = await supabase.from("user_role").select('*').eq("user_id", user.id).single();
//     userData = data;
//     userError = error;
//   } else {
//     userError = new Error("User not found");
//   }

//   console.log(userData);

//   return (
//     <div className="mx-4 mt-3">
//       <Card>
//         <CardHeader>
//           <CardTitle className="text-2xl">List of Lesson Planning Forms</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <FormsTable forms={forms as any} />
//         </CardContent>
//       </Card>
//     </div>
//   );
// }