using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ExamApp.Models.Classes
{
    public class ExamUser
    {
        public int IdExam { get; set; }
        public int IdUser { get; set; }

        public User User { get; set; }
    }
}
