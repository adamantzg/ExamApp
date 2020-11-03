using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ExamApp.Models;
using ExamApp.Models.Classes;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ExamApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class GroupController : ControllerBase
    {
        private IUnitOfWork unitOfWork;

        public GroupController(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;            
        }

        [HttpGet("")]
        public List<Group> GetAll()
        {
            return this.unitOfWork.GroupRepository.Get().ToList();
        }
    }
}