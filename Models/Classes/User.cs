using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace ExamApp.Models.Classes
{
    public class User
    {
        public int Id { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        public string Lastname { get; set; }
        [Required]
        public string Email { get; set; }
        public bool? Admin { get; set; }

        [NotMapped]
        public bool selected { get; set; }

        public List<UserCourse> UserCourses { get; set; }
        public List<UserGroup> UserGroups { get; set; }
    }
}
