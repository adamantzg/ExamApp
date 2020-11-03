using ExamApp.Models.Classes;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ExamApp.Controllers
{
    public class BaseController : ControllerBase
    {
        protected readonly IExamAppService examAppService;

        public BaseController(IExamAppService examAppService)
        {
            this.examAppService = examAppService;
        }

        public User CurrentUser => examAppService.GetCurrentUser(HttpContext.User);
        
    }
}
