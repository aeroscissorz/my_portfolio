"use client"
import { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Github, Linkedin, Mail, Award, Book, Code, Database, Server, ChevronLeft, ChevronRight, ArrowUp, Sun, Moon, Share2, Clock, Download, Check } from 'lucide-react'
import { useInView } from 'react-intersection-observer'
import { FC, ReactNode } from "react";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
//import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"

interface SectionHeaderProps {
  children: ReactNode; // Specify the type for children
}
interface SkillMapProps {
  skills: {
    [category: string]: string[]; // This defines skills as an object where keys are categories and values are arrays of strings
  };
}
interface Project {
  logo: string;
  name: string;
  description: string;
  technologies: string[];
  github: string;
}

interface ProjectCardProps {
  project: Project; // Define the type for the project prop
}
interface Achievement {
  title: string; // Define the structure of an achievement
  description: string;
}

interface AchievementTimelineProps {
  achievements: Achievement[]; // An array of Achievement objects
}
interface SectionHeaderProps {
  children: ReactNode; // Define the type for children
}

const NeuralNetworkBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    const nodes: { x: number; y: number; vx: number; vy: number; scale: number }[] = []
    const numNodes = 50
    const maxDistance = 150

    for (let i = 0; i < numNodes; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        scale: 1
      })
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      nodes.forEach(node => {
        node.x += node.vx
        node.y += node.vy

        if (node.x < 0 || node.x > canvas.width) node.vx *= -1
        if (node.y < 0 || node.y > canvas.height) node.vy *= -1

        ctx.beginPath()
        ctx.arc(node.x, node.y, 2 * node.scale, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(79, 209, 197, 0.8)'
        ctx.fill()

        // Pulsing animation
        node.scale = 1 + 0.2 * Math.sin(Date.now() * 0.005)
      })

      ctx.strokeStyle = 'rgba(79, 209, 197, 0.2)'
      ctx.lineWidth = 0.5
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x
          const dy = nodes[i].y - nodes[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < maxDistance) {
            ctx.beginPath()
            ctx.moveTo(nodes[i].x, nodes[i].y)
            ctx.lineTo(nodes[j].x, nodes[j].y)
            ctx.stroke()

            // Connection animation
            const scale = 1 + (maxDistance - distance) / maxDistance
            nodes[i].scale = Math.max(nodes[i].scale, scale)
            nodes[j].scale = Math.max(nodes[j].scale, scale)
          }
        }
      }

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [])

  return <canvas ref={canvasRef} className="fixed inset-0 w-full h-full" />
}

const ProjectCard: FC<ProjectCardProps> = ({ project }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.05 }}
      className="bg-gray-800 bg-opacity-80 backdrop-blur-sm rounded-lg overflow-hidden shadow-lg border border-gray-700 cursor-pointer transform transition-all duration-300 hover:shadow-2xl hover:border-teal-400"
    >
      <div className="p-6 flex flex-col h-full">
        <motion.div 
          className="flex items-center justify-center mb-4"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Image 
            src={project.logo} 
            alt={project.name} 
            width={80} 
            height={80} 
            className="rounded-full"
          />
        </motion.div>
        <h3 className="text-xl font-semibold mb-2 text-white">{project.name}</h3>
        <p className="text-gray-300 mb-4 flex-grow">{project.description}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {project.technologies.map((tech: any) => (
            <Badge key={tech} variant="secondary">{tech}</Badge>
          ))}
        </div>
        <div className="flex justify-start items-center">
          <Link
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-teal-400 hover:text-teal-300 transition-colors flex items-center"
          >
            <Github className="w-4 h-4 mr-2" />
            View on GitHub
          </Link>
        </div>
      </div>
    </motion.div>
  )
}

const SkillMap: FC<SkillMapProps> = ({ skills }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.5 }}
      className="grid grid-cols-1 md:grid-cols-2 gap-8"
    >
      {Object.entries(skills).map(([category, items], index) => (
        <motion.div
          key={category}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <Card className="bg-gray-800 bg-opacity-80 backdrop-blur-sm border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">{category}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {items.map((skill: any) => (
                  <Badge key={skill} variant="secondary">{skill}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  )
}

const AchievementTimeline: FC<AchievementTimelineProps> = ({ achievements }) => {
  return (
    <div className="max-w-3xl mx-auto">
      {achievements.map((achievement, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="mb-8 bg-gray-800 rounded-lg shadow-xl p-6 border border-gray-700"
        >
          <h3 className="text-2xl font-bold text-teal-400 mb-2">{achievement.title}</h3>
          <p className="text-gray-300">{achievement.description}</p>
        </motion.div>
      ))}
    </div>
  )
}

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener('scroll', toggleVisibility)

    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5, rotate: -180 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          exit={{ opacity: 0, scale: 0.5, rotate: 180 }}
          className="fixed bottom-4 right-4 z-50"
        >
          <Button onClick={scrollToTop} size="icon" className="rounded-full">
            <ArrowUp className="h-4 w-4 animate-bounce" />
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

const SectionHeader: FC<SectionHeaderProps> = ({ children }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <div className="flex justify-center">
      <motion.h2
        ref={ref}
        initial={{ opacity: 0, y: -20 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-bold mb-8 text-white relative inline-block"
      >
        {children}
      </motion.h2>
    </div>
  )
}

export default function EnhancedPortfolio() {
  const [activeSection, setActiveSection] = useState('home')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const { scrollY } = useScroll()
  const navbarBackground = useTransform(
    scrollY,
    [0, 100],
    ['rgba(31, 41, 55, 0)', 'rgba(31, 41, 55, 0.9)']
  )
  const navbarHeight = useTransform(scrollY, [0, 100], ['5rem', '4rem'])

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'about', 'projects', 'skills', 'achievements', 'contact']
      const currentSection = sections.find(section => {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          return rect.top <= 100 && rect.bottom >= 100
        }
        return false
      })
      if (currentSection) {
        setActiveSection(currentSection)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const form = e.currentTarget;
      const formData = new FormData(form);
      const response = await fetch(form.action, {
        method: form.method,
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });
      if (response.ok) {
        setIsSubmitted(true);
        form.reset();
      } else {
        throw new Error('Form submission failed');
      }
    } catch (error) {
      console.error('Error:', error);
      // Handle error (e.g., show error message to user)
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setIsSubmitted(false), 3000);
    }
  };
  const projects = [
    {
      name: 'DynImagic',
      description: 'Image processing web app using Python, OpenCV, and Flask to transform the colors of a single image based on the dominant colors of a group.',
      logo: 'https://drive.google.com/uc?export=view&id=1W-UK_9KNqr_Pgm2893X2mZSF0vb48kfD',
      technologies: ['Python', 'OpenCV', 'Flask'],
      github: 'https://github.com/aeroscissorz/DynlMagic'
    },
    {
      name: 'Babble',
      description: 'Real-time messaging app using MERN stack, Socket.io, and JWT with features like notifications, emoji support, and responsive design.',
      logo: 'https://drive.google.com/uc?export=view&id=1fpFRRnWsPqA15U0LpUsj9svHLUG5j16K',
      technologies: ['MERN stack', 'Socket.io','JWT'],
      github: 'https://github.com/aeroscissorz/babble'
    },
    {
      name: 'TerraTrack',
      description: 'Wildlife conservation solution using MATLAB and ACF for object detection, noise filtering, and accurate turtle tracking in videos.',
      logo: 'https://drive.google.com/uc?export=view&id=1lpeq_GBjMinYlrLbZ5lixEG3PEEIqU1Y',
      technologies: ['Matlab', 'ACF','MongoDB'],
      github: 'https://github.com/aeroscissorz/TerraTrack',
    },
    {
      name: 'Doofus Adventure',
      description: 'Platform-hopping game in Unity using C# with disappearing platforms, random timers, and JSON-based game configuration.',
      logo: 'https://drive.google.com/uc?export=view&id=1lMDGc8cq48hDZy9yIA9BoB4PeOs-hPhZ',
      technologies: ['C#', 'Unity', 'HLSL'],
      
      github: 'https://github.com/aeroscissorz/Doofus-Adventure-Game',
    }
  ]

  const skills = {
    'Programming Languages': ['Java', 'SQL', 'JavaScript', 'C++'],
    'Frameworks': ['Express', 'Springboot', 'Next.js'],
    'Developer Tools': ['Github', 'VS Code', 'Postman', 'IntelliJ'],
    'Other Tools': ['Git','Figma','Notion','Jira']
  }

  const achievements = [
    {
      title: "Hack-4-Impact Hackathon Runner-up",
      description: "Developed the Study-Buddy collaborative learning platform prototype in 48 hours. Led a team of four, integrating study groups, doubt-solving, leaderboards, and rating systems. Increased user engagement by 30% and received positive feedback from 50+ users."
    },
    {
      title: "StockSensei Project",
      description: "Created a machine learning-driven stock trading bot with sentiment analysis using the FinBERT model. Processed over 10,000 financial news articles. Achieved an average monthly return of 7% with the trading bot. Enabled GPU acceleration with PyTorch, reducing processing time by 50%."
    },
    {
      title: "CrediGuard Project",
      description: "Developed a credit card fraud detection system using Isolation Forest, LOF, and SVM algorithms. Achieved 98.5% accuracy with Isolation Forest, outperforming LOF (97.8%) and SVM (85.2%). Improved detection speed by 15% with optimized pre-processing for real-time fraud prevention."
    },
    {
      title: "AIJobScout Project",
      description: "Engineered an AI-powered resume evaluation and job matching tool using Google Generative AI and Streamlit. Analyzed over 200 resumes and job descriptions. Achieved 95% accuracy in content extraction using pdf2image and PIL."
    }
  ]

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 relative overflow-hidden font-sans">
      <NeuralNetworkBackground />
      <div className="relative z-10">
        <motion.header 
          className="fixed top-0 left-0 right-0 z-50 backdrop-blur-sm"
          style={{ backgroundColor: navbarBackground, height: navbarHeight }}
        >
          <nav className="container mx-auto px-6 h-full flex items-center">
            <ul className="flex justify-center space-x-4 overflow-x-auto">
              {['Home', 'About', 'Projects', 'Skills', 'Achievements', 'Contact'].map((item) => (
                <li key={item}>
                  <motion.button
                    onClick={() => scrollToSection(item.toLowerCase())}
                    className={`text-sm font-medium hover:text-teal-400 transition-colors whitespace-nowrap ${
                      activeSection === item.toLowerCase() ? 'text-teal-400' : 'text-white'
                    }`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {item}
                  </motion.button>
                </li>
              ))}
            </ul>
          </nav>
        </motion.header>

        <main className="pt-16">
          <section
            id="home"
            className="min-h-screen flex items-center justify-center px-4"
          >
            <div className="text-center">
              <motion.div 
                className="mb-8 relative inline-block"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Image
                  src="https://drive.google.com/uc?export=view&id=1SUBaKjchTu6G16_FafZhi8PWo5P_2J-k"
                  alt="Shubham Sharma"
                  width={200}
                  height={200}
                  className="rounded-full border-4 border-teal-400"
                />
              </motion.div>
              <motion.h1 
                className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-blue-500"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Shubham Sharma
              </motion.h1>
              <motion.h2 
                className="text-xl md:text-2xl mb-6 text-white"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                Software Development Engineer | Program Analyst
              </motion.h2>
              <motion.p 
                className="max-w-2xl mx-auto text-gray-300 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                👋 Hi, I'm Shubham – a Software Developer Engineer on a mission to turning complex problems into clean, scalable solutions. Let's build something awesome!
              </motion.p>
              <motion.div 
                className="flex flex-col sm:flex-row items-center justify-center gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <Button 
                  className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-full transition-colors duration-300"
                  onClick={() => window.open("https://github.com/aeroscissorz", "_blank")}
                >
                  Explore My Work
                </Button>
                <Button 
  className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-full transition-colors duration-300 flex items-center justify-center space-x-2"
  onClick={() => window.open("https://drive.google.com/file/d/1pxd6QtQo98qOi6msmTj_Bj71OUVl7VrU/view?usp=drive_link", "_blank")}
>
  <Download className="w-4 h-4" />
  <span>Resume</span>
</Button>

              </motion.div>
            </div>
          </section>

          <section
            id="about"
            className="py-16 px-4"
          >
            <div className="container mx-auto">
              <SectionHeader>About Me</SectionHeader>
              <motion.div 
                className="bg-gray-800 bg-opacity-80 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-gray-700"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.8 }}
                transition={{ duration: 0.5 }}
              >
                <p className="text-gray-300 mb-4">
                I'm currently pursuing a B.Tech in Electronics and Communication Engineering at Vellore Institute of Technology. My passion lies in building scalable software solutions and tackling complex challenges through efficient system design. With expertise in Java, JavaScript, and frameworks like SpringBoot and React, I thrive on creating impactful technologies.
                </p>
                <p className="text-gray-300">
                Whether it's developing robust backend systems, optimizing application performance, or exploring innovative solutions, I'm always eager to contribute to meaningful projects that drive real-world impact.
                </p>
              </motion.div>
            </div>
          </section>

          <section
            id="projects"
            className="py-16 bg-gray-800 bg-opacity-50 px-4"
          >
            <div className="container mx-auto">
              <SectionHeader>Projects</SectionHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {projects.map((project, index) => (
                  <motion.div
                    key={project.name}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <ProjectCard project={project} />
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          <section
            id="skills"
            className="py-16 px-4"
          >
            <div className="container mx-auto">
              <SectionHeader>Skills</SectionHeader>
              <SkillMap skills={skills} />
            </div>
          </section>

          

          <section
            id="contact"
            className="py-16 px-4"
          >
            <div className="container mx-auto">
              <SectionHeader>Get in Touch</SectionHeader>
              <motion.div 
                className="max-w-md mx-auto bg-gray-900 bg-opacity-80 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-gray-700"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.8 }}
                transition={{ duration: 0.5 }}
              >
                <form
                  className="space-y-4"
                  action="https://formspree.io/f/mvgoprdl"
                  method="POST"
                  onSubmit={handleSubmit}
                >
                  <Input
                    type="text"
                    name="name"
                    placeholder="Name"
                    required
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                  <Input
                    type="email"
                    name="email"
                    placeholder="Email"
                    required
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                  <textarea
                    name="message"
                    placeholder="Message"
                    rows={4}
                    required
                    className="w-full px-3 py-2 text-white bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  ></textarea>
                  <Button
                    type="submit"
                    className={`w-full ${
                      isSubmitting
                        ? 'bg-gray-500'
                        : isSubmitted
                        ? 'bg-green-500'
                        : 'bg-teal-600 hover:bg-teal-700'
                    } text-white transition-colors duration-300`}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center">
                        <Clock className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                        Sending...
                      </span>
                    ) : isSubmitted ? (
                      <span className="flex items-center justify-center">
                        <Check className="-ml-1 mr-3 h-5 w-5 text-white" />
                        Sent!
                      </span>
                    ) : (
                      'Send Message'
                    )}
                  </Button>
                </form>
                <div className="mt-8 flex justify-center space-x-4">
                  <motion.a
                    href="mailto:shubhamsharma10112003@gmail.com"
                    className="text-teal-400 hover:text-teal-300 transition-colors"
                    whileHover={{ scale: 1.2, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Mail className="w-6 h-6" />
                  </motion.a>
                  <motion.a
                    href="https://www.linkedin.com/in/shubham-sharma-89bb56211/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-teal-400 hover:text-teal-300 transition-colors"
                    whileHover={{ scale: 1.2, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Linkedin className="w-6 h-6" />
                  </motion.a>
                  <motion.a
                    href="https://github.com/aeroscissorz"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-teal-400 hover:text-teal-300 transition-colors"
                    whileHover={{ scale: 1.2, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Github className="w-6 h-6" />
                  </motion.a>
                </div>
              </motion.div>
            </div>
          </section>
        </main>

        <footer className="bg-gray-900 py-8 px-4">
          <div className="container mx-auto">
            <div className="flex flex-wrap justify-between items-center">
              
              
             
            </div>
            <div className="mt-8 text-center text-gray-400">
              <p>&copy; {new Date().getFullYear()} Shubham Sharma. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
      <ScrollToTopButton />
    </div>
  )
}