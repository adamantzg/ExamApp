using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ExamApp.Models.Classes
{
    public class UserGroup
    {
        public int IdUser { get; set; }
        public int IdGroup { get; set; }

        public Group Group { get; set; }
        public User User { get; set; }
    }
}
