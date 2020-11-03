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
    public class QuestionTypeController : BaseController
    {
        private IUnitOfWork unitOfWork;

        public QuestionTypeController(IUnitOfWork unitOfWork, IExamAppService examAppService) : base(examAppService)
        {
            this.unitOfWork = unitOfWork;
        }

        [HttpGet("")]
        public IActionResult GetAll()
        {
            if (CurrentUser?.Admin == true)
                return Ok(unitOfWork.QuestionTypeRepository.Get().ToList());
            return Unauthorized();
        }

        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            if (CurrentUser?.Admin == true)
                return Ok(unitOfWork.QuestionTypeRepository.Get(e => e.Id == id)
                    .FirstOrDefault());
            return Unauthorized();
        }

        [HttpPost("")]
        public IActionResult Create(QuestionType QuestionType)
        {
            if (CurrentUser?.Admin == true)
            {
                unitOfWork.QuestionTypeRepository.Insert(QuestionType);
                unitOfWork.Save();
                return Ok(QuestionType);
            }
            return Unauthorized();
        }

        [HttpPut("")]
        public IActionResult Update(QuestionType QuestionType)
        {
            if (CurrentUser?.Admin == true)
            {
                unitOfWork.QuestionTypeRepository.Update(QuestionType);
                unitOfWork.Save();
                return Ok(QuestionType);
            }
            return Unauthorized();
        }

        [HttpDelete("")]
        public IActionResult Delete(int id)
        {
            if (CurrentUser?.Admin == true)
            {
                unitOfWork.QuestionTypeRepository.Delete(id);
                return Ok();
            }
            return Unauthorized();
        }
    }
}