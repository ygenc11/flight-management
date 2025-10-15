using Microsoft.EntityFrameworkCore;
using Serilog;

// Add Serilog configuration at the very start of the file
// before building the application
Log.Logger = new LoggerConfiguration()
    .WriteTo.Console()
    .WriteTo.Logger(lc => lc
        .Filter.ByIncludingOnly(le => le.Properties.ContainsKey("SourceContext") && le.Properties["SourceContext"].ToString().StartsWith("\"FlightManagement.Controllers"))
        .WriteTo.File(
            "logs/log.txt",
            restrictedToMinimumLevel: Serilog.Events.LogEventLevel.Information,
            outputTemplate: "{Timestamp:yyyy-MM-dd HH:mm:ss} [{Level}] {SourceContext} {Message}{NewLine}{Exception}",
            rollingInterval: RollingInterval.Day
        )
    )
    .CreateLogger();

var builder = WebApplication.CreateBuilder(args);

// Use Serilog for logging
builder.Host.UseSerilog();


// Add services to the container.
//sql server connection string
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<FlightManagement.Data.FlightManagementContext>(options =>
    options.UseSqlServer(connectionString));

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
        options.JsonSerializerOptions.PropertyNameCaseInsensitive = true;
    });

// Register Repositories
builder.Services.AddScoped<FlightManagement.Repositories.IAircraftRepository, FlightManagement.Repositories.AircraftRepository>();
builder.Services.AddScoped<FlightManagement.Repositories.ICrewRepository, FlightManagement.Repositories.CrewRepository>();
builder.Services.AddScoped<FlightManagement.Repositories.IAirportRepository, FlightManagement.Repositories.AirportRepository>();
builder.Services.AddScoped<FlightManagement.Repositories.IFlightRepository, FlightManagement.Repositories.FlightRepository>();

// Register Services
builder.Services.AddScoped<FlightManagement.Services.IAircraftService, FlightManagement.Services.AircraftService>();
builder.Services.AddScoped<FlightManagement.Services.ICrewService, FlightManagement.Services.CrewService>();
builder.Services.AddScoped<FlightManagement.Services.IAirportService, FlightManagement.Services.AirportService>();
builder.Services.AddScoped<FlightManagement.Services.IFlightService, FlightManagement.Services.FlightService>();
builder.Services.AddSingleton<FlightManagement.Services.IFlightForecastingService, FlightManagement.Services.FlightForecastingService>();

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwagger();
    app.UseSwaggerUI();
}


// Use CORS - En önce olmalı
app.UseCors();

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

// "/" to redirect to Swagger UI
app.MapGet("/", context =>
{
    context.Response.Redirect("/swagger");
    return System.Threading.Tasks.Task.CompletedTask;
});

app.Run();
