import { ModeToggle } from "./theme-switcher";

export default function Navbar({step}) {
  return (
    <div className="p-1 flex justify-between border-b px-10 py-3">
      <h1 className="text-2xl font-bold ">Onboarding</h1>

         

      <ModeToggle />
    </div>
  );
}
