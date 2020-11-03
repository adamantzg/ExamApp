using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ExamApp.Models;

namespace ExamApp.Controllers
{
    public class CrudController<T> : BaseController where T : class
    {
        private readonly IUnitOfWork unitOfWork;

        public CrudController(IExamAppService examAppService, IUnitOfWork unitOfWork) : base(examAppService)
        {
            this.unitOfWork = unitOfWork;
        }

        
    }
}