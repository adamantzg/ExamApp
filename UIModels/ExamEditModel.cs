using ExamApp.Models.Classes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ExamApp.UIModels
{
    public class ExamEditModel
    {
        public Exam Exam { get; set; }
        public IEnumerable<ExamType> ExamTypes { get; set; }
        public IEnumerable<Database> Databases { get; set; }
        public IEnumerable<Course> Courses { get; set; }
        public IEnumerable<QuestionType> QuestionTypes { get; set; }
        public IEnumerable<User> Users { get; set; }
    }
}
