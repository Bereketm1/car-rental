import { Type } from 'class-transformer';
import { IsString, IsEmail, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCustomerDto {
  @ApiProperty({ example: 'Abebe' })
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Kebede' })
  @IsString()
  lastName: string;

  @ApiProperty({ example: 'abebe@email.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '+251911223344' })
  @IsString()
  phone: string;

  @ApiProperty({ example: 'ETH-1234567890', required: false })
  @IsOptional()
  @IsString()
  nationalId?: string;

  @ApiProperty({ example: 'Bole, Addis Ababa' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ example: 'Addis Ababa' })
  @IsOptional()
  @IsString()
  city?: string;
}

export class CreateLoanApplicationDto {
  @ApiProperty()
  @IsString()
  customerId: string;

  @ApiProperty()
  @IsString()
  vehicleId: string;

  @ApiProperty({ example: 1500000 })
  @Type(() => Number)
  @IsNumber()
  requestedAmount: number;

  @ApiProperty({ example: 60 })
  @Type(() => Number)
  @IsNumber()
  termMonths: number;

  @ApiProperty({ example: 45000 })
  @Type(() => Number)
  @IsNumber()
  monthlyIncome: number;

  @ApiProperty({ example: 'employed' })
  @IsString()
  employmentStatus: string;
}

export class CreateVehicleInterestDto {
  @ApiProperty()
  @IsString()
  vehicleId: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}
