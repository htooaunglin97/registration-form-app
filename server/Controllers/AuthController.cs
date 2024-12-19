using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Text;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
  private readonly AppDbContext _context;
  private readonly IHttpClientFactory _clientFactory;
  private const string RECAPTCHA_SECRET_KEY = "6LdZomgqAAAAAKEeJ9gpX-qawTyF7ilX39mkJc9e";
  public AuthController(AppDbContext context, IHttpClientFactory clientFactory)
  {
    _context = context;
    _clientFactory = clientFactory;
  }

  [HttpPost("register")]
  public async Task<IActionResult> Register([FromBody] RegisterRequest model)
  {
    if (!ModelState.IsValid)
      return BadRequest("Invalid data.");

    // Check if the username already exists
    var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.UserName == model.UserName);
    if (existingUser != null)
    {
      return Conflict(new { message = "Username already exists" });
    }

    // Generate salt and hash for password
    var salt = BCrypt.Net.BCrypt.GenerateSalt();
    var hashedPassword = BCrypt.Net.BCrypt.HashPassword(model.Password, salt);

    // Store user with hashed password and salt
    var user = new User
    {
      UserName = model.UserName,
      PasswordHash = Encoding.UTF8.GetBytes(hashedPassword),
      PasswordSalt = Encoding.UTF8.GetBytes(salt)
    };
    _context.Users.Add(user);
    await _context.SaveChangesAsync();

    return Ok(new { message = "Registration successful!" });
  }

  private async Task<bool> ValidateRecaptcha(string recaptchaToken)
  {
    var client = _clientFactory.CreateClient();
    var response = await client.PostAsync(
        $"https://www.google.com/recaptcha/api/siteverify?secret={RECAPTCHA_SECRET_KEY}&response={recaptchaToken}",
        new StringContent("", Encoding.UTF8, "application/x-www-form-urlencoded")
    );

    var jsonResponse = await response.Content.ReadAsStringAsync();
    var recaptchaResult = JsonConvert.DeserializeObject<RecaptchaResponse>(jsonResponse);

    return recaptchaResult.Success && recaptchaResult.Score >= 0.5;
  }

  public class RecaptchaResponse
  {
    [JsonProperty("success")]
    public bool Success { get; set; }

    [JsonProperty("score")]
    public float Score { get; set; }

    [JsonProperty("action")]
    public string Action { get; set; }

    [JsonProperty("challenge_ts")]
    public string ChallengeTimeStamp { get; set; }

    [JsonProperty("hostname")]
    public string Hostname { get; set; }
  }

  public class RegisterRequest
  {
    public string UserName { get; set; }
    public string Password { get; set; }
    public string RecaptchaToken { get; set; }
  }
}


