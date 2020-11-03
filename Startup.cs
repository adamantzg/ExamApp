using System;
using System.Linq;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using ExamApp.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authentication.AzureAD.UI;
using Microsoft.AspNetCore.Authentication;

namespace ExamApp
{
    public class Startup
    {
        public Startup(IConfiguration configuration, IWebHostEnvironment env)
        {
            Configuration = configuration;
            Env = env;
        }

        public IConfiguration Configuration { get; }
        public IWebHostEnvironment Env { get; }

        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllers().AddNewtonsoftJson(options => {
                options.SerializerSettings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore;
            });


            services.AddRazorPages();
            services.AddCors(options =>
            {
                options.AddPolicy("AllowAllOrigins",
                    builder =>
                    {
                        builder
                            .AllowAnyOrigin()
                            .AllowAnyHeader()
                            .AllowAnyMethod();
                    });
            });

            services.AddDbContextPool<MyContext>(options => options
              // replace with your connection string
              .UseSqlServer(Configuration.GetConnectionString("myConnString"))
            );

            services.AddScoped<IUnitOfWork, UnitOfWork>();
            services.AddScoped<IExamAppService, ExamAppService>();
            services.AddScoped<ISqlRunner, SqlRunner>();
            IMvcBuilder builder = services.AddRazorPages();

//#if DEBUG
//            if (Env.IsDevelopment())
//            {
//                builder.AddRazorRuntimeCompilation();
//            }
//#endif
            services.AddControllersWithViews();
            services.AddControllers();                        

            services.AddProtectedWebApi(Configuration);
            

            //services.AddAuthentication().AddMicrosoftAccount(microsoftOptions =>
            //{
            //    microsoftOptions.ClientId = Configuration["Authentication:Microsoft:ClientId"];
            //    microsoftOptions.ClientSecret = Configuration["Authentication:Microsoft:ClientSecret"];
            //});
        }

        public void Configure(IApplicationBuilder app)
        {
            app.UseCors("AllowAllOrigins");

            var angularRoutes = new[] {
                 "/home",
                 "/login",
                 "/user",
                 "/exam",
                 "/myexams"
             };

            app.Use(async (context, next) =>
            {
                if (context.Request.Path.HasValue && null != angularRoutes.FirstOrDefault(
                    (ar) => context.Request.Path.Value.StartsWith(ar, StringComparison.OrdinalIgnoreCase)))
                {
                    context.Request.Path = new PathString("/");
                }

                await next();
            });

            

            app.UseDefaultFiles();
            app.UseStaticFiles();

            app.UseRouting();
            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller=Home}/{action=Index}/{id?}");
                //endpoints.MapRazorPages();
            });
        }
    }
}
