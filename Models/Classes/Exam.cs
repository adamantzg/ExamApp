using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ExamApp.Models.Classes
{
    public class Exam
    {
        public int Id { get; set; }
        [Required]
        public string Title { get; set; }
        public DateTime? StartDateTime { get; set; }
        public int? IdCourse { get; set; }
        public int? MaxTime { get; set; }
        public int? IdType { get; set; }
        public int? IdDatabase { get; set; }
        public bool? RandomOrder { get; set; }
        public bool? ShowResults { get; set; }
        public bool? TimeConstrained { get; set; }
        public bool? UserSpecificDb { get; set; }

        public List<Question> Questions { get; set; }
        public List<Submission> Submissions { get; set; }
        public List<ExamResource> ExamResources { get; set; }
        public List<ExamUser> ExamUsers { get; set; }

        public Course Course { get; set; }
        public ExamType ExamType { get; set; }
        public Database Database { get; set; }
    }
}
