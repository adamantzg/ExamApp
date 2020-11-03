using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.RazorPages;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ExamApp.Pages
{
    public class IndexModel : PageModel
    {
        private readonly IWebHostEnvironment env;
        public string WebRoot { get; set; }

        public IndexModel(IWebHostEnvironment env)
        {
            this.env = env;
            WebRoot = env.WebRootPath;
        }
    }
}
