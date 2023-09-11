import winston from 'winston'
import ecsFormat = require('@elastic/ecs-winston-format')

export const logger = winston.createLogger({
  level: 'info', // Уровень логирования (например, info)
  format: process.env.NODE_ENV === 'development'
    ? winston.format.combine(
      winston.format.colorize(), // Добавляем цвет в вывод
      winston.format.simple() // Простой формат вывода
    )
    : ecsFormat(), // Используем ECS формат
  transports: [
    new winston.transports.Console(),
    // Другие транспорты, если нужно
  ],
}) as {
  info: (message: string, ...meta: any[]) => winston.Logger
  error: (message: string, ...meta: any[]) => winston.Logger
  debug: (message: string, ...meta: any[]) => winston.Logger
}

// Используйте логгер для записи сообщений
logger.info('This is an info message')
logger.error('This is an error message')