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
    public class DatabaseController : BaseController
    {
        private IUnitOfWork unitOfWork;

        public DatabaseController(IUnitOfWork unitOfWork, IExamAppService examAppService) : base(examAppService)
        {
            this.unitOfWork = unitOfWork;
        }

        [HttpGet("")]
        public IActionResult GetAll()
        {
            if (CurrentUser?.Admin == true)
                return Ok(unitOfWork.DatabaseRepository.Get().ToList());
            return Unauthorized();
        }

        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            if (CurrentUser?.Admin == true)
                return Ok(unitOfWork.DatabaseRepository.Get(e => e.Id == id)
                    .FirstOrDefault());
            return Unauthorized();
        }

        [HttpPost("")]
        public IActionResult Create(Database database)
        {
            if (CurrentUser?.Admin == true)
            {
                unitOfWork.DatabaseRepository.Insert(database);
                unitOfWork.Save();
                return Ok(database);
            }
            return Unauthorized();
        }

        [HttpPut("")]
        public IActionResult Update(Database database)
        {
            if (CurrentUser?.Admin == true)
            {
                unitOfWork.DatabaseRepository.Update(database);
                unitOfWork.Save();
                return Ok(database);
            }
            return Unauthorized();
        }

        [HttpDelete("")]
        public IActionResult Delete(int id)
        {
            if (CurrentUser?.Admin == true)
            {
                unitOfWork.DatabaseRepository.Delete(id);
                return Ok();
            }
            return Unauthorized();
        }
    }
}