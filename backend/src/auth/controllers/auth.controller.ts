import { Controller, Post, Body, UseGuards, Get, Request, Delete, Param, Ip, Headers } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from '../services/auth.service';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/enums/user-role.enum';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'License limit reached or account deactivated' })
  async login(
    @Body() loginDto: LoginDto,
    @Ip() ipAddress: string,
    @Headers('user-agent') userAgent: string,
  ) {
    return this.authService.login(loginDto, ipAddress, userAgent);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'User logout' })
  @ApiResponse({ status: 200, description: 'Logout successful' })
  async logout(@Request() req: any) {
    const sessionToken = req.headers['x-session-token'];
    if (sessionToken) {
      await this.authService.logout(sessionToken);
    }
    return { message: 'Logged out successfully' };
  }

  @Post('register')
  @ApiOperation({ summary: 'Register new user' })
  @ApiResponse({ status: 201, description: 'User successfully created' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 403, description: 'License limit reached' })
  async register(@Body() registerDto: RegisterDto, @Request() req?: any) {
    const companyId = req?.user?.companyId;
    return this.authService.register(registerDto, companyId);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({ status: 200, description: 'Profile retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getProfile(@Request() req) {
    return req.user;
  }

  @Get('license-info')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get company license information' })
  @ApiResponse({ status: 200, description: 'License info retrieved successfully' })
  getLicenseInfo(@Request() req) {
    return this.authService.getCompanyLicenseInfo(req.user.companyId);
  }

  @Delete('force-logout/:userId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Force logout a user (Admin only)' })
  @ApiResponse({ status: 200, description: 'User logged out successfully' })
  @ApiResponse({ status: 403, description: 'Insufficient permissions' })
  async forceLogoutUser(@Request() req, @Param('userId') userId: string) {
    await this.authService.forceLogoutUser(req.user.id, userId);
    return { message: 'User logged out successfully' };
  }
}