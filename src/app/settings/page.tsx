import { inputStyles, labelStyles } from "@/utils/styles/input";

export default async function Page() {
  return (
    <main className="mx-auto flex w-full max-w-7xl flex-grow flex-col">
      <h1 className="p-4 pb-0 text-display-xs font-semibold sm:p-8 sm:pb-0 md:text-display-sm">
        Settings
      </h1>
      <div className="flex flex-col gap-5 p-4 sm:p-8">
        <div className="flex flex-col gap-x-8 gap-y-5 sm:flex-row">
          <div className="flex flex-grow flex-col sm:max-w-80">
            <p className={labelStyles()}>Class upcoming notifications</p>
            <p className="text-secondary mt-1 text-text-sm font-medium">
              Receive notifications for upcoming classes.
            </p>
          </div>
          <select
            className={inputStyles(
              {
                size: "sm"
              },
              "w-full sm:w-60"
            )}
          >
            <option value="0">Do not notify</option>
            <option value="15m">15 minutes before class</option>
            <option value="30m">30 minutes before class</option>
            <option value="45m">45 minutes before class</option>
            <option value="1h">1 hour before class</option>
            <option value="2h">2 hours before class</option>
          </select>
        </div>
        <div className="border-t" />
        <div className="flex flex-col gap-x-8 gap-y-5 sm:flex-row">
          <div className="flex flex-grow flex-col sm:max-w-80">
            <p className={labelStyles()}>Low attendance notifications</p>
            <p className="text-secondary mt-1 text-text-sm font-medium">
              Recieve a notification when your attendance is about to fall below
              a certain threshold.
            </p>
          </div>
          <select
            className={inputStyles(
              {
                size: "sm"
              },
              "w-full sm:w-60"
            )}
          >
            <option value="0">Do not notify</option>
            <option value="25">25%</option>
            <option value="30">30%</option>
            <option value="35">35%</option>
            <option value="40">40%</option>
            <option value="45">45%</option>
            <option value="50">50%</option>
            <option value="55">55%</option>
            <option value="60">60%</option>
            <option value="65">65%</option>
            <option value="70">70%</option>
            <option value="75">75%</option>
          </select>
        </div>
      </div>
    </main>
  );
}
