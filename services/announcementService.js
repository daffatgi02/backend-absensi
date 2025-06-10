const { Announcement, Employee, Division } = require('../models');
const { Op } = require('sequelize');
const Helpers = require('../utils/helpers');

class AnnouncementService {
  async getAllAnnouncements(filters = {}) {
    try {
      const {
        targetType,
        priority,
        isActive,
        search,
        page = 1,
        limit = 20
      } = filters;

      const whereClause = {};
      
      if (targetType) {
        whereClause.targetType = targetType;
      }
      
      if (priority) {
        whereClause.priority = priority;
      }
      
      if (isActive !== undefined) {
        whereClause.isActive = isActive;
      }
      
      if (search) {
        whereClause[Op.or] = [
          { title: { [Op.like]: `%${search}%` } },
          { content: { [Op.like]: `%${search}%` } }
        ];
      }

      const offset = (page - 1) * limit;

      const announcements = await Announcement.findAndCountAll({
        where: whereClause,
        include: [
          {
            model: Employee,
            as: 'creator',
            attributes: ['fullName', 'employeeId']
          }
        ],
        order: [['priority', 'DESC'], ['createdAt', 'DESC']],
        limit: parseInt(limit),
        offset: offset
      });

      return {
        announcements: announcements.rows,
        pagination: Helpers.calculatePagination(page, limit, announcements.count)
      };
    } catch (error) {
      throw error;
    }
  }

  async getAnnouncementById(id) {
    try {
      const announcement = await Announcement.findByPk(id, {
        include: [
          {
            model: Employee,
            as: 'creator',
            attributes: ['fullName', 'employeeId']
          }
        ]
      });

      if (!announcement) {
        throw new Error('Announcement not found');
      }

      return announcement;
    } catch (error) {
      throw error;
    }
  }

  async createAnnouncement(data) {
    try {
      const announcement = await Announcement.create(data);
      return await this.getAnnouncementById(announcement.id);
    } catch (error) {
      throw error;
    }
  }

  async updateAnnouncement(id, data) {
    try {
      const announcement = await Announcement.findByPk(id);
      
      if (!announcement) {
        throw new Error('Announcement not found');
      }

      await announcement.update(data);
      return await this.getAnnouncementById(id);
    } catch (error) {
      throw error;
    }
  }

async deleteAnnouncement(id) {
    try {
      const announcement = await Announcement.findByPk(id);
      
      if (!announcement) {
        throw new Error('Announcement not found');
      }

      await announcement.update({ isActive: false });
      return { message: 'Announcement deleted successfully' };
    } catch (error) {
      throw error;
    }
  }

  async publishAnnouncement(id) {
    try {
      const announcement = await Announcement.findByPk(id);
      
      if (!announcement) {
        throw new Error('Announcement not found');
      }

      await announcement.update({ 
        publishedAt: new Date(),
        isActive: true
      });
      
      return await this.getAnnouncementById(id);
    } catch (error) {
      throw error;
    }
  }

  async getAnnouncementsForEmployee(employeeId, divisionId) {
    try {
      const announcements = await Announcement.findAll({
        where: {
          isActive: true,
          [Op.or]: [
            { targetType: 'all' },
            { 
              targetType: 'division',
              targetId: divisionId
            },
            {
              targetType: 'individual',
              targetId: employeeId
            }
          ],
          [Op.or]: [
            { expiresAt: null },
            { expiresAt: { [Op.gte]: new Date() } }
          ]
        },
        include: [
          {
            model: Employee,
            as: 'creator',
            attributes: ['fullName']
          }
        ],
        order: [['priority', 'DESC'], ['createdAt', 'DESC']],
        limit: 10
      });

      return announcements;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new AnnouncementService();