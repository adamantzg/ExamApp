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
    public class ExamTypeController : BaseController
    {
        private IUnitOfWork unitOfWork;

        public ExamTypeController(IUnitOfWork unitOfWork, IExamAppService examAppService) : base(examAppService)
        {
            this.unitOfWork = unitOfWork;
        }

        [HttpGet("")]
        public IActionResult GetAll()
        {
            if (CurrentUser?.Admin == true)
                return Ok(unitOfWork.ExamTypeRepository.Get().ToList());
            return Unauthorized();
        }

        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            if (CurrentUser?.Admin == true)
                return Ok(unitOfWork.ExamTypeRepository.Get(e => e.Id == id)
                    .FirstOrDefault());
            return Unauthorized();
        }

        [HttpPost("")]
        public IActionResult Create(ExamType examType)
        {
            if (CurrentUser?.Admin == true)
            {
                unitOfWork.ExamTypeRepository.Insert(examType);
                unitOfWork.Save();
                return Ok(examType);
            }
            return Unauthorized();
        }

        [HttpPut("")]
        public IActionResult Update(ExamType examType)
        {
            if (CurrentUser?.Admin == true)
            {
                unitOfWork.ExamTypeRepository.Update(examType);
                unitOfWork.Save();
                return Ok(examType);
            }
            return Unauthorized();
        }

        [HttpDelete("")]
        public IActionResult Delete(int id)
        {
            if (CurrentUser?.Admin == true)
            {
                unitOfWork.ExamTypeRepository.Delete(id);
                return Ok();
            }
            return Unauthorized();
        }
    }
}