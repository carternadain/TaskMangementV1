import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  getAllTasks() {
    return this.tasksService.findAll();
  }

  @Get(':id')
  getTask(@Param('id') id: string) {
    return this.tasksService.findOne(id);
  }

  @Post()
  createTask(@Body() task: any) {
    return this.tasksService.create(task);
  }

  @Put(':id')
  updateTask(@Param('id') id: string, @Body() task: any) {
    return this.tasksService.update(id, task);
  }

  @Delete(':id')
  deleteTask(@Param('id') id: string) {
    return this.tasksService.remove(id);
  }

  @Get('stats/dashboard')
  getStats() {
    return this.tasksService.getStats();
  }
}