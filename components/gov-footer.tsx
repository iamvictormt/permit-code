"use client"

export function GovFooter() {
  return (
    <footer className="w-full bg-muted/50 border-t border-border mt-auto">
      {/* Crown icon */}
      <div className="flex justify-center py-6">
        
      </div>

      {/* Links */}
      <div className="max-w-4xl mx-auto px-6 pb-6">
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-6">
          <span className="text-sm text-foreground hover:underline cursor-pointer">
            Privacy
          </span>
          <span className="text-sm text-foreground hover:underline cursor-pointer">
            Cookies
          </span>
          <span className="text-sm text-foreground hover:underline cursor-pointer">
            Accessibility statement
          </span>
          <span className="text-sm text-foreground hover:underline cursor-pointer">
            Account terms and conditions
          </span>
        </div>

        {/* OGL and Copyright */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          <div className="flex items-start gap-3">
            
            
          </div>

          
        </div>
      </div>
    </footer>
  )
}
