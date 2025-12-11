import { GetStaticProps } from "next";
import Head from "next/head";
import Header from "../components/Header";
import Hero from "../components/Hero";
import { Experience, PageInfo, Skill, Project, Social } from "../typings";
import About from "../components/About";
import WorkExperience from "../components/WorkExperience";
import Skills from "../components/Skills";
import Projects from "../components/Projects";
import ContactMe from "../components/ContactMe";
import Link from "next/link";
import { HomeIcon } from "@heroicons/react/24/solid";
import ChatWidget from "../components/ChatWidget";

type Props = {
  pageInfo: PageInfo;
  experiences: Experience[];
  skills: Skill[];
  projects: Project[];
  socials: Social[];
};

const Home = ({ pageInfo, experiences, projects, skills, socials }: Props) => {
  return (
    <div
      className="bg-lightBackground text-darkBlack h-screen snap-y snap-mandatory
    overflow-y-scroll overflow-x-hidden z-0 scrollbar-thin scrollbar-track-gray-400/20 scrollbar-thumb-darkGreen/80"
    >
      <Head>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <title>{"Ismail Ahouari - Portfolio"}</title>
        <meta name="description" content="Ismail Ahouari - Data Scientist & AI Engineer specializing in distributed learning, image processing, and agentic LLM infrastructure." />
      </Head>

      {/* Header */}
      <Header socials={socials} />

      {/* Hero */}
      <section id="hero" className="snap-start">
        <Hero pageInfo={pageInfo} />
      </section>

      {/* About */}
      <section id="about" className="snap-center">
        <About pageInfo={pageInfo} />
      </section>

      {/* Experiences */}
      <section id="experience" className="snap-center">
        <WorkExperience experiences={experiences} />
      </section>

      {/* Skills */}
      <section id="skills" className="snap-start">
        <Skills skills={skills} />
      </section>

      {/* Projects */}
      <section id="projects" className="snap-start">
        <Projects projects={projects} />
      </section>

      {/* Contact */}
      <section id="contact" className="snap-start">
        <ContactMe />
      </section>

      <Link href="#hero">
        <footer className="sticky bottom-5 w-full cursor-pointer">
          <div className="flex items-center justify-center">
            <div className="h-10 w-10 bg-darkGreen/80 rounded-full flex items-center justify-center">
              <HomeIcon className="h-7 w-17 pb-0.5 hover:grayscale-100 text-white animate-pulse" />
            </div>
          </div>
        </footer>
      </Link>

      {/* AI Chat Widget */}
      <ChatWidget />
    </div>
  );
};

export default Home;

export const getStaticProps: GetStaticProps<Props> = async () => {
  // Static data for Ismail Ahouari's portfolio
  // HUMAN ACTION REQUIRED: Replace hero-avatar.svg with your actual photo (hero-avatar.jpg)
  const pageInfo: PageInfo = {
    _id: "1",
    name: "Ismail Ahouari",
    role: "Data Scientist & AI Engineer",
    backgroundInformation: `I am a Data Science graduate specialized in distributed learning, image processing, and building agentic LLM infrastructure. My work spans from benchmarking Split Learning frameworks (SLPerf) to designing multi-tenant AI systems with tool orchestration using Cloudflare Workers and Supabase. I'm passionate about making machine learning more accessible and efficient through innovative distributed approaches.`,
    email: "ismailahouari123@gmail.com",
    heroImage: "/images/ismail.jpeg",
    profilePic: "/images/ismail2.jpeg",
  };

  const experiences: Experience[] = [
    {
      _id: "exp1",
      company: "LISER (Luxembourg Institute of Socio-Economic Research)",
      companyImage: "/images/liser-logo.jpg",
      dateStarted: "2025-01-01",
      dateEnded: "2025-04-01",
      isCurrentlyWorkingHere: false,
      jobTitle: "Data Science Associate",
      points: [
        "Implemented a scalable multilingual semantic classification pipeline using Pandas and Polars for efficient large-scale text data processing",
        "Built data preprocessing modules with BeautifulSoup for HTML extraction, spaCy for text normalization and deduplication",
        "Integrated Stanza for language-specific sentence segmentation across multilingual NLP corpora",
        "Developed keyword extraction using Sentence-Transformers (Hugging Face) with semantic similarity for AI-related indicator identification",
        "Benchmarked semantic similarity pipeline against GPT-based models (OpenAI GPT, Mixtral) to assess performance accuracy",
      ],
      technologies: [
        { _id: "tech1", title: "Python", image: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" },
        { _id: "tech2", title: "Hugging Face", image: "https://huggingface.co/front/assets/huggingface_logo-noborder.svg" },
        { _id: "tech3", title: "Polars", image: "https://raw.githubusercontent.com/pola-rs/polars-static/master/logos/polars-logo-dark.svg" },
        { _id: "tech4", title: "Pandas", image: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pandas/pandas-original.svg" },
        { _id: "tech5", title: "spaCy", image: "https://upload.wikimedia.org/wikipedia/commons/8/88/SpaCy_logo.svg" },
        { _id: "tech6", title: "Git", image: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" },
      ],
    },
    {
      _id: "exp2",
      company: "C2DH - University of Luxembourg",
      companyImage: "/images/chu-liege-logo.png",
      dateStarted: "2024-06-01",
      dateEnded: "2024-12-01",
      isCurrentlyWorkingHere: false,
      jobTitle: "Data Science Intern",
      points: [
        "Implemented a Wikibase-based knowledge graph using Docker containers for isolated, reproducible environments",
        "Automated data ingestion pipelines (Python & Wikibase API) to process structured records with semantic annotations",
        "Developed a modular relational data model managing RDF triples across reusable properties",
        "Created multilingual support system with automated translation capabilities",
      ],
      technologies: [
        { _id: "tech1", title: "Python", image: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" },
        { _id: "tech2", title: "Docker", image: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" },
        { _id: "tech3", title: "SPARQL", image: "https://www.w3.org/RDF/icons/rdf_w3c_icon.128.gif" },
        { _id: "tech4", title: "Wikibase", image: "https://www.mediawiki.org/static/images/icons/mediawikiwiki.svg" },
        { _id: "tech5", title: "Git", image: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" },
      ],
    },
  ];

  const skills: Skill[] = [
    // Languages
    { _id: "s1", title: "Python", image: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg", progress: 95 },
    { _id: "s2", title: "C/C++", image: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg", progress: 75 },
    { _id: "s3", title: "SQL", image: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/azuresqldatabase/azuresqldatabase-original.svg", progress: 85 },
    { _id: "s4", title: "R", image: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/r/r-original.svg", progress: 70 },
    // Data Tools
    { _id: "s5", title: "MLflow", image: "https://www.mlflow.org/img/mlflow-black.svg", progress: 80 },
    { _id: "s6", title: "Apache Spark", image: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apachespark/apachespark-original.svg", progress: 75 },
    { _id: "s7", title: "Docker", image: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg", progress: 85 },
    { _id: "s8", title: "Airflow", image: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apacheairflow/apacheairflow-original.svg", progress: 75 },
    { _id: "s9", title: "SQL Server", image: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/microsoftsqlserver/microsoftsqlserver-original.svg", progress: 80 },
    { _id: "s10", title: "ChromaDB", image: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg", progress: 80 },
    // Libraries & Frameworks
    { _id: "s11", title: "PyTorch", image: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pytorch/pytorch-original.svg", progress: 90 },
    { _id: "s12", title: "TensorFlow", image: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg", progress: 85 },
    { _id: "s13", title: "Pandas", image: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pandas/pandas-original.svg", progress: 95 },
    { _id: "s14", title: "FastAPI", image: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg", progress: 85 },
    { _id: "s15", title: "Grafana", image: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/grafana/grafana-original.svg", progress: 75 },
    { _id: "s16", title: "LangGraph", image: "https://avatars.githubusercontent.com/u/126733545?s=200&v=4", progress: 80 },
    { _id: "s17", title: "Hugging Face", image: "https://huggingface.co/front/assets/huggingface_logo-noborder.svg", progress: 85 },
    // Other
    { _id: "s18", title: "Cloudflare", image: "https://cdn.simpleicons.org/cloudflare/F38020", progress: 80 },
    { _id: "s19", title: "Supabase", image: "https://cdn.simpleicons.org/supabase/3FCF8E", progress: 75 },
    { _id: "s20", title: "Tableau", image: "https://img.icons8.com/color/480/tableau-software.png", progress: 75 },
    { _id: "s21", title: "Git", image: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg", progress: 90 },
    { _id: "s22", title: "Flask", image: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flask/flask-original.svg", progress: 80 },
    { _id: "s23", title: "AWS", image: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-plain-wordmark.svg", progress: 75 },
    { _id: "s24", title: "PostgreSQL", image: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg", progress: 80 },
  ];

  const projects: Project[] = [
    {
      _id: "p1",
      title: "Agentic LLM Infrastructure with MCP Tools",
      image: "/images/Agentic LLM Infrastructure with MCP Tools.png",
      summary: "Designed a multi-tenant agentic runtime with tool orchestration using Durable Objects and Supabase with Row-Level Security. Built a scalable system for deploying AI agents with proper isolation and security controls.",
      technologies: [
        { _id: "tech3", title: "LangChain", image: "https://avatars.githubusercontent.com/u/126733545?s=200&v=4" },
        { _id: "tech7", title: "Cloudflare", image: "https://cdn.simpleicons.org/cloudflare/F38020" },
        { _id: "tech8", title: "Supabase", image: "https://cdn.simpleicons.org/supabase/3FCF8E" },
      ],
      linkToBuild: "https://github.com",
    },
    {
      _id: "p2",
      title: "Split Learning Performance Benchmark (SLPerf)",
      image: "/images/slperf-project.png",
      summary: "Benchmarked Vanilla SL, U-Shaped SL, and SplitFed under IID and non-IID settings for vision and GNN tasks. This research contributes to understanding the trade-offs between privacy, communication efficiency, and model accuracy in distributed learning scenarios.",
      technologies: [
        { _id: "tech1", title: "Python", image: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" },
        { _id: "tech2", title: "PyTorch", image: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pytorch/pytorch-original.svg" },
      ],
      linkToBuild: "https://github.com",
    },
    {
      _id: "p3",
      title: "Label-Noise Robust Food Image Classification",
      image: "/images/food-classification-project.png",
      summary: "Developed noise-robust food classification models for real-world images using CNNs and robust training strategies. Addressed the challenge of learning from noisy labels commonly found in crowd-sourced datasets.",
      technologies: [
        { _id: "tech1", title: "Python", image: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" },
        { _id: "tech2", title: "PyTorch", image: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pytorch/pytorch-original.svg" },
        { _id: "tech4", title: "TensorFlow", image: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg" },
      ],
      linkToBuild: "https://github.com",
    },
  ];

  const socials: Social[] = [
    { _id: "soc1", title: "GitHub", url: "https://github.com/ismailahouari" },
    { _id: "soc2", title: "LinkedIn", url: "https://linkedin.com/in/ismailahouari" },
  ];

  return {
    props: {
      pageInfo,
      experiences,
      skills,
      projects,
      socials,
    },
  };
};
