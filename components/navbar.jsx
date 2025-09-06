import { ModeToggle } from "./theme-switcher";

export default function Navbar({step}) {
  return (
    <div className="p-1 flex justify-between border-b px-10 py-3">
      <h1 className="text-2xl font-bold ">Onboarding</h1>

         <div className="flex flex-wrap justify-center gap-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className={`
                px-5 py-2 rounded-sm font-bold transition-colors
                ${i === step 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-muted text-muted-foreground dark:bg-muted dark:text-muted-foreground"
                }
              `}
            >
              Step {i}
            </div>
          ))}
        </div>

      <ModeToggle />
    </div>
  );
}
