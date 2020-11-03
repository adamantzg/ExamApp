using ExamApp.Models;
using ExamApp.Models.Classes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace ExamApp
{
    public interface IExamAppService
    {
        User GetCurrentUser(ClaimsPrincipal claimsPrincipal);
    }

    public class ExamAppService : IExamAppService
    {
        private readonly IUnitOfWork unitOfWork;
        private User user = null;

        public ExamAppService(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public User GetCurrentUser(ClaimsPrincipal claimsPrincipal)
        {
            if(user == null)
            {
                var email = claimsPrincipal.FindFirst(c => c.Type == ClaimConstants.PreferredUserName)?.Value;
                user = unitOfWork.UserRepository.
                    Get(u => u.Email == email, includeProperties: "UserCourses,UserGroups").FirstOrDefault();
            }
            return user;
        }
    }
}
