using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ExamApp.Models;
using ExamApp.Models.Classes;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ExamApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CourseController : BaseController
    {
        private IUnitOfWork unitOfWork;

        public CourseController(IUnitOfWork unitOfWork, IExamAppService examAppService) : base(examAppService)
        {
            this.unitOfWork = unitOfWork;
        }

        [HttpGet("")]
        public IActionResult GetAll()
        {
            if (CurrentUser?.Admin == true)
                return Ok(unitOfWork.CourseRepository.Get().ToList());
            return Unauthorized();
        }

        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            if (CurrentUser?.Admin == true)
                return Ok(unitOfWork.CourseRepository.Get(e => e.Id == id)
                    .FirstOrDefault());
            return Unauthorized();
        }

        [HttpPost("")]
        public IActionResult Create(Course course)
        {
            if (CurrentUser?.Admin == true)
            {
                unitOfWork.CourseRepository.Insert(course);
                unitOfWork.Save();
                return Ok(course);
            }
            return Unauthorized();
        }

        [HttpPut("")]
        public IActionResult Update(Course course)
        {
            if (CurrentUser?.Admin == true)
            {
                unitOfWork.CourseRepository.Update(course);
                unitOfWork.Save();
                return Ok(course);
            }
            return Unauthorized();
        }

        [HttpDelete("")]
        public IActionResult Delete(int id)
        {
            if (CurrentUser?.Admin == true)
            {
                unitOfWork.CourseRepository.Delete(id);
                return Ok();
            }
            return Unauthorized();
        }
    }
}