using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ExamApp.Models;
using ExamApp.Models.Classes;
using ExamApp.UIModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;

namespace ExamApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ExamController : BaseController
    {
        private IUnitOfWork unitOfWork;
        private readonly ISqlRunner sqlRunner;
        private readonly IConfiguration configuration;

        public ExamController(IUnitOfWork unitOfWork, IExamAppService examAppService,
            ISqlRunner sqlRunner, IConfiguration configuration) : base(examAppService)
        {
            this.unitOfWork = unitOfWork;
            this.sqlRunner = sqlRunner;
            this.configuration = configuration;
        }

        [HttpGet("")]
        public IActionResult GetAll()
        {
            if(CurrentUser?.Admin == true) 
                return Ok(unitOfWork.ExamRepository.Get(includeProperties: "ExamType,Course").ToList());
            return Unauthorized();
        }

        [HttpGet("getAssigned")]
        public IActionResult GetAssigned() 
        {
            var userId = CurrentUser?.Id;
            return Ok(unitOfWork.ExamRepository.GetQuery(e => e.ExamUsers.Any(eu => eu.IdUser == userId), 
                includeProperties: "Questions,ExamUsers,Course,ExamType,Submissions.SubmissionAnswers").
                Select(e => new
                {
                    e.Id, e.Title, e.StartDateTime, e.ExamType,e.Course,e.ShowResults, e.MaxTime, e.TimeConstrained,
                    totalPoints = e.Questions.Sum(q => q.Points),
                    submissions = e.Submissions.Where(s => s.IdUser == userId),
                    points = e.Submissions.Where(s => s.IdUser == userId).SelectMany(s => s.SubmissionAnswers).Sum(a => a.Points)                    
                })
                );
        }


        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            if (CurrentUser?.Admin == true)
                return Ok(unitOfWork.ExamRepository.Get(e => e.Id == id, includeProperties: "Questions,ExamUsers,ExamResources")
                    .FirstOrDefault());
            return Unauthorized();
        }

        [HttpGet("getModel")]
        public IActionResult GetModel(int? id = null)
        {
            if (CurrentUser?.Admin == true)
            {
                var model = new ExamEditModel
                {
                    Exam = id != null ? unitOfWork.ExamRepository.Get(e => e.Id == id, 
                    includeProperties: "Questions.Children,ExamUsers.User,ExamResources")
                    .FirstOrDefault() :
                    new Exam
                    {
                        StartDateTime = DateTime.Now,
                        Questions = new List<Question>()
                    },
                    Courses = unitOfWork.CourseRepository.Get(),
                    ExamTypes = unitOfWork.ExamTypeRepository.Get(),
                    Databases = unitOfWork.DatabaseRepository.Get(),
                    QuestionTypes = unitOfWork.QuestionTypeRepository.Get(),
                    Users = unitOfWork.UserRepository.Get()
                };
                if(id != null)
                {
                    var selectedUserIds = model.Exam.ExamUsers.Select(eu => eu.IdUser).ToList();
                    foreach (var u in model.Users)
                    {
                        u.selected = selectedUserIds.Contains(u.Id);
                    }
                }                
                return Ok(model);
            }
            return Unauthorized();            
        }

        [HttpGet("getForSubmission")]
        public IActionResult GetForSubmission(int id)
        {
            var exam = unitOfWork.ExamRepository.Get(e => e.Id == id,
                includeProperties: "Database,ExamUsers,Questions.Children,Submissions.SubmissionAnswers.Question, Submissions.SubmissionQuestionOrders")
                .FirstOrDefault();
            var currUserId = CurrentUser?.Id;
            if (currUserId == null)
                return Unauthorized();
            if(exam == null)
            {
                return BadRequest("Exam doesn't exist.");
            }
            if (exam.ExamUsers.Count(eu=>eu.IdUser == currUserId) == 0)
            {
                return Unauthorized("You are not allowed to submit this exam");
            }
            var now = DateTime.Now;
            if(exam.TimeConstrained == true && (now < exam.StartDateTime || now > exam.StartDateTime?.AddSeconds(exam.MaxTime ?? 0)))
            {
                return BadRequest("Exam not ready or expired");
            }
            var submission = exam.Submissions.FirstOrDefault(s => s.IdUser == currUserId);
            if (submission == null)
            {
                submission = new Submission
                {
                    IdUser = CurrentUser?.Id,
                    IpAddress = HttpContext.Connection.RemoteIpAddress.ToString(),
                    TimeStarted = DateTime.Now,
                    SubmissionAnswers = new List<SubmissionAnswer>()
                };
                if(exam.RandomOrder == true)
                {
                    RandomizeQuestions(exam, submission);
                }
                exam.Submissions.Add(submission);
                unitOfWork.Save();         
                if(exam.RandomOrder == true)
                {
                    ReorderQuestions(exam, currUserId);
                }
            } 
            else
            {
                if(submission.TimeStarted == null)
                {
                    submission.TimeStarted = DateTime.Now;
                    unitOfWork.Save();
                }
                ReorderQuestions(exam, currUserId);
            }
            exam.Submissions = exam.Submissions.Where(s => s.IdUser == currUserId).ToList();            
            return Ok(exam);
        }

        
        private void RandomizeQuestions(Exam exam, Submission submission)
        {
            var remainingQuestions = exam.Questions.Select(q => q.Id).ToList();
            var rand = new Random();
            var orderNo = 1;
            int? idQuestion = null;            
            if (submission.SubmissionQuestionOrders == null)
                submission.SubmissionQuestionOrders = new List<SubmissionQuestionOrder>();
            while(remainingQuestions.Count > 1)
            {
                var index = rand.Next(1, remainingQuestions.Count + 1) - 1;
                idQuestion = remainingQuestions[index];                
                submission.SubmissionQuestionOrders.Add(new SubmissionQuestionOrder { IdQuestion = idQuestion, OrderNo = orderNo++ });
                remainingQuestions.RemoveAt(index);
            }
            idQuestion = remainingQuestions[0];            
            submission.SubmissionQuestionOrders.Add(new SubmissionQuestionOrder { IdQuestion = idQuestion, OrderNo = orderNo });
        }

        private void ReorderQuestions(Exam exam, int? currUserId)
        {
            if (exam.RandomOrder == true)
            {
                var submission = exam.Submissions.FirstOrDefault(s => s.IdUser == currUserId);
                var dictOrders = submission.SubmissionQuestionOrders.ToDictionary(so => so.IdQuestion);
                foreach (var q in exam.Questions)
                {
                    if (dictOrders.ContainsKey(q.Id))
                        q.OrderNo = dictOrders[q.Id].OrderNo;
                }
            }
        }


        [HttpGet("getForReview")]
        public IActionResult GetForReview(int id)
        {
            var currUserId = CurrentUser?.Id;
            if (currUserId == null)
                return Unauthorized();
            var exam = unitOfWork.ExamRepository.Get(e => e.Id == id,
                includeProperties: "Database,ExamUsers,Questions.Children,Submissions.SubmissionAnswers,Submissions.SubmissionQuestionOrders")
                .FirstOrDefault();
            if (exam.ExamUsers.Count(eu => eu.IdUser == currUserId) == 0)
            {
                return Unauthorized("You are not allowed to review this exam");
            }
            var now = DateTime.Now;
            if (exam.TimeConstrained == true && now >= exam.StartDateTime && now <= exam.StartDateTime?.AddSeconds(exam.MaxTime ?? 0))
            {
                return BadRequest("Exam not yet ready for review");
            }
            exam.Submissions = exam.Submissions.Where(s => s.IdUser == currUserId).ToList();
            ReorderQuestions(exam, currUserId);
            return Ok(exam);
        }

        [HttpPost("")]
        public IActionResult Create(Exam exam)
        {
            if(CurrentUser?.Admin == true)
            {
                unitOfWork.ExamRepository.Insert(exam);
                unitOfWork.Save();
                return Ok(exam);
            }
            return Unauthorized();
        }

        [HttpPut("")]
        public IActionResult Update(Exam exam)
        {
            if (CurrentUser?.Admin == true)
            {
                unitOfWork.ExamRepository.Update(exam);
                unitOfWork.Save();
                return Ok(exam);
            }
            return Unauthorized();
        }

        [HttpDelete("")]
        public IActionResult Delete(int id)
        {
            if (CurrentUser?.Admin == true)
            {
                unitOfWork.ExamRepository.Delete(id);
                unitOfWork.Save();
                return Ok();
            }
            return Unauthorized();
        }

        [HttpPost("executeQuery")]
        public IActionResult ExecuteQuery(int idExam, [FromBody] SubmissionAnswer a, int? idUser = null)
        {
            var exam = unitOfWork.ExamRepository.Get(e => e.Id == idExam, includeProperties: "Database, Questions.Children").FirstOrDefault();
            if(idUser != null && CurrentUser?.Admin != true)
            {
                return BadRequest("Invalid user");
            }
            if (idUser == null)
                idUser = CurrentUser?.Id;
            try
            {
                if (exam != null)
                {
                    if(a.Question == null)
                    {
                        a.Question = exam.Questions.Union(exam.Questions.SelectMany(q => q.Children)).FirstOrDefault(q => q.Id == a.IdQuestion);
                    }
                    var connString = string.Format(configuration.GetConnectionString("execConnString"), 
                        exam.Database.Name + (exam.UserSpecificDb == true ? $"_{idUser}" : "") );
                    return Ok(sqlRunner.ExecuteSql(a.AnswerText, connString, action: a.Question?.IdType == QuestionType.SqlAction));
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
            return BadRequest("No exam found");
        }

        [HttpPost("submitExam")]
        public IActionResult SubmitExam(Exam submittedExam)
        {
            var id = submittedExam.Id;
            var exam = unitOfWork.ExamRepository.Get(e => e.Id == id,
                includeProperties: "Database,ExamUsers,Submissions.SubmissionAnswers").FirstOrDefault();
            if (exam.ExamUsers.Count(eu => eu.IdUser == CurrentUser?.Id) == 0)
            {
                return Unauthorized("You are not allowed to submit this exam");
            }
            var now = DateTime.Now;
            if (exam.TimeConstrained == true && (now < exam.StartDateTime || now > exam.StartDateTime?.AddSeconds(exam.MaxTime + 5 ?? 0)))
            {
                return BadRequest("Exam not ready or expired");
            }
            var currUserId = CurrentUser?.Id;
            var subm = exam.Submissions.FirstOrDefault(s => s.IdUser == currUserId);
            if (subm != null)
            {
                subm.TimeSubmitted = DateTime.Now;
            }
            SaveSubmissions(subm, submittedExam.Submissions.FirstOrDefault());
            return Ok();
        }

        [HttpPost("saveExam")]
        public IActionResult SaveExam(Exam submittedExam)
        {
            try
            {
                var id = submittedExam.Id;
                var exam = unitOfWork.ExamRepository.Get(e => e.Id == id,
                    includeProperties: "Database,ExamUsers,Submissions.SubmissionAnswers").FirstOrDefault();
                if (exam.ExamUsers.Count(eu => eu.IdUser == CurrentUser?.Id) == 0)
                {
                    return Unauthorized("You are not allowed to submit this exam");
                }
                var currUserId = CurrentUser?.Id;
                var subm = exam.Submissions.FirstOrDefault(s => s.IdUser == currUserId);
                if (subm != null)
                {
                    subm.TimeLastSaved = DateTime.Now;
                }
                SaveSubmissions(subm, submittedExam.Submissions.FirstOrDefault());
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("submissions")]
        public IActionResult GetSubmissions(int idExam)
        {
            if (CurrentUser?.Admin == true)
            {
                return Ok(unitOfWork.ExamRepository.GetQuery(e => e.Id == idExam, includeProperties: "Questions,Submissions.SubmissionAnswers, Submissions.User")
                .Select(e => new
                {
                    questions = e.Questions.Count(),
                    totalPoints = e.Questions.Sum(q => q.Points),
                    submissions = e.Submissions.Select(s => new
                    {
                        s.Id,
                        s.TimeStarted,
                        s.TimeSubmitted,
                        s.User,
                        answers = s.SubmissionAnswers.Where(a => a.AnswerText != null).Count(),
                        points = s.SubmissionAnswers.Sum(a => a.Points) ?? 0
                    })
                }).FirstOrDefault());
            }
            return Unauthorized();
        }

        [HttpGet("submission")]
        public IActionResult GetSubmission(int id)
        {
            if (CurrentUser?.Admin == true)
            {
                var submission = unitOfWork.SubmissionRepository.Get(s => s.Id == id,
                    includeProperties: "Exam,SubmissionAnswers.Question.Parent,User, SubmissionAnswers.Logs,SubmissionQuestionOrders").FirstOrDefault();
                if(submission != null)
                {
                    foreach (var l in submission.SubmissionAnswers.SelectMany(a => a.Logs)) {
                        l.AnswerText = string.Empty;
                    }
                    var dictOrders = submission.SubmissionQuestionOrders.ToDictionary(so => so.IdQuestion);
                    var answers = new List<SubmissionAnswer>();
                    foreach (var a in submission.SubmissionAnswers)
                    {
                        if(a.Question.IdParent == null)
                        {
                            if (dictOrders.ContainsKey(a.IdQuestion))
                                a.Question.OrderNo = dictOrders[a.IdQuestion].OrderNo;
                            answers.Add(a);
                        }
                        else
                        {
                            var answer = answers.FirstOrDefault(x => x.IdQuestion == a.Question.IdParent);
                            if (answer == null)
                            {
                                answer = new SubmissionAnswer
                                {
                                    IdQuestion = a.Question.IdParent,
                                    Question = a.Question.Parent,
                                    ChildAnswers = new List<SubmissionAnswer>(),
                                    Logs = new List<SubmissionAnswerLog>()
                                };
                                if (dictOrders.ContainsKey(answer.IdQuestion))
                                    answer.Question.OrderNo = dictOrders[answer.IdQuestion].OrderNo;
                                answers.Add(answer);
                            } else
                            {
                                if (answer.Logs == null)
                                    answer.Logs = new List<SubmissionAnswerLog>();
                                if(a.Logs != null)
                                    answer.Logs.AddRange(a.Logs);
                            }
                            answer.ChildAnswers.Add(a);                            

                        }
                        
                    }
                    submission.SubmissionAnswers = answers.OrderBy(a => a.Question.OrderNo).ToList();
                    return Ok(submission);
                }
                return BadRequest("No submission found");

            }
            return Unauthorized();
        }

        [HttpGet("submissionAnswerLogs")]
        public IActionResult GetAnswerLogs(int idQuestion)
        {
            if(CurrentUser?.Admin == true)
            {
                return Ok(unitOfWork.SubmissionRepository.GetAnswerLogs(idQuestion) );
            }
            return Unauthorized();
        }

        [HttpPut("updateSubmission")]
        public IActionResult UpdateSubmission(Submission submission)
        {
            if (CurrentUser?.Admin == true)
            {
                var currentSubm = unitOfWork.SubmissionRepository.Get(s => s.Id == submission.Id, includeProperties: "SubmissionAnswers").FirstOrDefault();
                if(currentSubm != null)
                {
                    var allAnswers = submission.SubmissionAnswers.Where(a => a.Id > 0)
                        .Union(submission.SubmissionAnswers.Where(a => a.ChildAnswers != null).SelectMany(a => a.ChildAnswers)).ToList();
                    foreach(var a in allAnswers)
                    {
                        var existingAnswer = currentSubm.SubmissionAnswers.FirstOrDefault(ans => ans.Id == a.Id);
                        if (existingAnswer != null && a.Points != null)
                            existingAnswer.Points = a.Points;
                    }
                    unitOfWork.Save();
                    return Ok();
                }
                return BadRequest("Submission doesn't exist");
            }
            return Unauthorized();
        }

        [HttpPost("resetSubmission")]
        public IActionResult ResetSubmission(int idExam, bool resetAnswers = false)
        {
            var exam = unitOfWork.ExamRepository.Get(e => e.Id == idExam,
                    includeProperties: "Course,ExamUsers,Submissions.SubmissionAnswers").FirstOrDefault();
            if (exam.ExamUsers.Count(eu => eu.IdUser == CurrentUser?.Id) == 0)
            {
                return Unauthorized("You are not allowed to reset this exam");
            }
            var currUserId = CurrentUser?.Id;
            var subm = exam.Submissions.FirstOrDefault(s => s.IdUser == currUserId);
            if (subm != null)
            {
                subm.TimeStarted = null;
                subm.TimeSubmitted = null;
                if(resetAnswers)
                {
                    foreach(var a in subm.SubmissionAnswers)
                    {
                        a.AnswerText = string.Empty;
                    }
                }
                unitOfWork.Save();
                return Ok(exam);
            }
            return BadRequest("No submission to reset");
        }

        [HttpGet("copy")]
        public Exam CopyExam(int id)
        {
            return unitOfWork.ExamRepository.Copy(id);
        }

        private void SaveSubmissions(Submission submDesc, Submission submSource)
        {
            if(submDesc != null && submSource != null)
            {
                foreach(var answer in submSource.SubmissionAnswers)
                {
                    var destAnswer = submDesc.SubmissionAnswers.FirstOrDefault(a => a.IdQuestion == answer.IdQuestion);
                    if(destAnswer == null)
                    {
                        destAnswer = new SubmissionAnswer
                        {
                            IdQuestion = answer.IdQuestion,
                            AnswerText = answer.AnswerText
                        };
                        submDesc.SubmissionAnswers.Add(destAnswer);
                    } 
                    else
                    {
                        destAnswer.AnswerText = answer.AnswerText;
                    }
                }
                unitOfWork.Save();
            }
        }
    }
}


