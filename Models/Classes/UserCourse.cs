using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ExamApp.Models.Classes
{
    public class UserCourse
    {
        public int Id { get; set; }
        public int? IdUser { get; set; }
        public int? IdCourse { get; set; }
        public int? IdGroup { get; set; }

        public User User { get; set; }
        public Course Course { get; set; }
        public Group Group { get; set; }
    }
}
