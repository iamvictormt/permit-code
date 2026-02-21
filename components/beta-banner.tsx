
export function BetaBanner() {
  return (
    <div className="max-w-[960px] mx-auto w-full px-4 py-4">
      <div className="border-b border-govuk-grey-2 pb-2 flex items-center gap-3 text-sm">
        <strong className="bg-govuk-blue text-white px-2 py-0.5 font-bold">Beta</strong>
        <span>
          This is a new service – your <a href="#" className="text-govuk-blue underline hover:text-[#003078]">feedback</a> will help us to improve it.
        </span>
      </div>
    </div>
  );
}
