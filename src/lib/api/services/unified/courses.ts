import { apiClient } from "@/lib/api/client-mock";
import type {
  Course,
  CourseListResponse,
  CourseCreateRequest,
  CourseUpdateRequest,
  CourseListParams,
  CourseAccess,
} from "@/types/course";

class UnifiedCourseService {
  private basePath = "/api/courses";

  async getCourses(params: CourseListParams = {}): Promise<CourseListResponse> {
    const searchParams = new URLSearchParams();

    if (params.page) searchParams.append("page", params.page.toString());
    if (params.limit) searchParams.append("limit", params.limit.toString());
    if (params.search) searchParams.append("search", params.search);
    if (params.sortBy) searchParams.append("sortBy", params.sortBy);
    if (params.sortOrder) searchParams.append("sortOrder", params.sortOrder);
    if (params.filters) {
      Object.entries(params.filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(`filters[${key}]`, value.toString());
        }
      });
    }

    const queryString = searchParams.toString();
    const endpoint = queryString
      ? `${this.basePath}?${queryString}`
      : this.basePath;

    const response = await apiClient.get<CourseListResponse>(endpoint);
    return response.data!;
  }

  async getCourse(id: number): Promise<Course> {
    const response = await apiClient.get<Course>(`${this.basePath}/${id}`);
    return response.data!;
  }

  async createCourse(data: CourseCreateRequest): Promise<Course> {
    const response = await apiClient.post<Course>(this.basePath, data);
    return response.data!;
  }

  async updateCourse(id: number, data: CourseUpdateRequest): Promise<Course> {
    const response = await apiClient.put<Course>(`${this.basePath}/${id}`, data);
    return response.data!;
  }

  async deleteCourse(id: number): Promise<void> {
    await apiClient.delete(`${this.basePath}/${id}`);
  }

  async checkCourseAccess(courseId: number): Promise<CourseAccess> {
    const response = await apiClient.get<CourseAccess>(`${this.basePath}/${courseId}/access`);
    return response.data!;
  }

  // Mock data for development
  private mockCourses: Course[] = [
    {
      id: 1,
      name: "Introduction to Web Development",
      description: "Learn the fundamentals of web development including HTML, CSS, and JavaScript.",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      thumbnailUrl: "/assets/placeholder-image.jpeg",
      duration: 3600, // 1 hour
      isActive: true,
      createdAt: "2024-01-15T10:00:00Z",
      updatedAt: "2024-01-15T10:00:00Z",
      createdBy: 1,
    },
    {
      id: 2,
      name: "Advanced React Patterns",
      description: "Master advanced React patterns including hooks, context, and performance optimization.",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      thumbnailUrl: "/assets/placeholder-banner.png",
      duration: 5400, // 1.5 hours
      isActive: true,
      createdAt: "2024-01-20T14:30:00Z",
      updatedAt: "2024-01-20T14:30:00Z",
      createdBy: 1,
    },
    {
      id: 3,
      name: "Database Design Fundamentals",
      description: "Learn database design principles, normalization, and SQL optimization.",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      thumbnailUrl: "/assets/placeholder-image.jpeg",
      duration: 7200, // 2 hours
      isActive: false,
      createdAt: "2024-01-25T09:15:00Z",
      updatedAt: "2024-01-25T09:15:00Z",
      createdBy: 1,
    },
    {
      id: 4,
      name: "Node.js Backend Development",
      description: "Build robust backend applications with Node.js, Express, and MongoDB.",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      thumbnailUrl: "/assets/placeholder-banner.png",
      duration: 4800, // 1.3 hours
      isActive: true,
      createdAt: "2024-01-30T11:20:00Z",
      updatedAt: "2024-01-30T11:20:00Z",
      createdBy: 1,
    },
    {
      id: 5,
      name: "UI/UX Design Principles",
      description: "Master the fundamentals of user interface and user experience design.",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      thumbnailUrl: "/assets/placeholder-image.jpeg",
      duration: 6000, // 1.7 hours
      isActive: true,
      createdAt: "2024-02-05T16:45:00Z",
      updatedAt: "2024-02-05T16:45:00Z",
      createdBy: 1,
    },
  ];

  // Mock implementation for development
  async getCoursesMock(params: CourseListParams = {}): Promise<CourseListResponse> {
    let filteredCourses = [...this.mockCourses];

    // Apply search filter
    if (params.search) {
      const searchLower = params.search.toLowerCase();
      filteredCourses = filteredCourses.filter(
        (course) =>
          course.name.toLowerCase().includes(searchLower) ||
          course.description.toLowerCase().includes(searchLower)
      );
    }

    // Apply filters
    if (params.filters) {
      if (params.filters.isActive !== undefined) {
        filteredCourses = filteredCourses.filter(
          (course) => course.isActive === params.filters!.isActive
        );
      }
      if (params.filters.createdBy) {
        filteredCourses = filteredCourses.filter(
          (course) => course.createdBy === params.filters!.createdBy
        );
      }
    }

    // Apply sorting
    if (params.sortBy) {
      filteredCourses.sort((a, b) => {
        const aValue = a[params.sortBy as keyof Course];
        const bValue = b[params.sortBy as keyof Course];
        
        if (aValue === undefined || bValue === undefined) return 0;
        if (aValue < bValue) return params.sortOrder === "desc" ? 1 : -1;
        if (aValue > bValue) return params.sortOrder === "desc" ? -1 : 1;
        return 0;
      });
    }

    // Apply pagination
    const page = params.page || 1;
    const limit = params.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedCourses = filteredCourses.slice(startIndex, endIndex);

    return {
      courses: paginatedCourses,
      total: filteredCourses.length,
      page,
      limit,
      totalPages: Math.ceil(filteredCourses.length / limit),
    };
  }

  async getCourseMock(id: number): Promise<Course> {
    const course = this.mockCourses.find((c) => c.id === id);
    if (!course) {
      throw new Error(`Course with id ${id} not found`);
    }
    return course;
  }

  async createCourseMock(data: CourseCreateRequest): Promise<Course> {
    const newCourse: Course = {
      id: this.mockCourses.length + 1,
      ...data,
      isActive: data.isActive ?? true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 1, // Mock user ID
    };
    this.mockCourses.push(newCourse);
    return newCourse;
  }

  async updateCourseMock(id: number, data: CourseUpdateRequest): Promise<Course> {
    const courseIndex = this.mockCourses.findIndex((c) => c.id === id);
    if (courseIndex === -1) {
      throw new Error(`Course with id ${id} not found`);
    }
    
    this.mockCourses[courseIndex] = {
      ...this.mockCourses[courseIndex],
      ...data,
      updatedAt: new Date().toISOString(),
      updatedBy: 1, // Mock user ID
    };
    
    return this.mockCourses[courseIndex];
  }

  async deleteCourseMock(id: number): Promise<void> {
    const courseIndex = this.mockCourses.findIndex((c) => c.id === id);
    if (courseIndex === -1) {
      throw new Error(`Course with id ${id} not found`);
    }
    this.mockCourses.splice(courseIndex, 1);
  }

  async checkCourseAccessMock(courseId: number): Promise<CourseAccess> {
    // Mock: Check if user has made any purchases
    // In a real app, this would check the user's order history
    const hasPurchased = Math.random() > 0.5; // Mock random access
    
    return {
      hasAccess: hasPurchased,
      reason: hasPurchased ? "Access granted" : "Purchase required to access this course",
      purchaseRequired: !hasPurchased,
    };
  }
}

export const unifiedCourseService = new UnifiedCourseService();
