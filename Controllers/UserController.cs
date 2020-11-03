using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
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
    public class UserController : BaseController
    {
        private readonly IUnitOfWork unitOfWork;
        
        public UserController(IUnitOfWork unitOfWork, IExamAppService examAppService) : base(examAppService)
        {
            this.unitOfWork = unitOfWork;
            
        }

        [HttpGet("")]
        public IActionResult GetUsers()
        {
            if(GetCurrentUser()?.Admin == true)
                return Ok(unitOfWork.UserRepository.Get().ToList());
            return Unauthorized();
        }

        [HttpGet("{id}")]
        public User GetUser(int id)
        {
            return unitOfWork.UserRepository.Get(u => u.Id == id, includeProperties: "UserGroups, UserCourses").FirstOrDefault();
        }

        [HttpGet("getcurrent")]
        public User GetCurrentUser() 
        {
            return CurrentUser;
        }

        [HttpPost("")]
        public IActionResult Create(User user)
        {   
            if(GetCurrentUser()?.Admin == true)
            {
                unitOfWork.UserRepository.Insert(user);
                unitOfWork.Save();
                return Ok(user);
            }
            return Unauthorized();
        }

        [HttpPut("")]
        public IActionResult Update(User user)
        {
            if (GetCurrentUser()?.Admin == true)
            {
                unitOfWork.UserRepository.Update(user);
                unitOfWork.Save();
                return Ok(user); 
            }
            return Unauthorized();
        }

        [HttpDelete("")]
        public IActionResult Delete(int id)
        {
            if (GetCurrentUser()?.Admin == true)
            {
                unitOfWork.UserRepository.DeleteByIds(new[] { id });
                return Ok();
            }
            return Unauthorized();
        }
                
    }
}