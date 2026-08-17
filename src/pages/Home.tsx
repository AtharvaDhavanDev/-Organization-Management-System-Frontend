import {
  ArrowRight,
  Bell,
  Check,
  Folder,
  Home as HomeIcon,
  Search,
  Settings,
  Users,
  ClipboardCheck,
  UserRound,
  Terminal,
} from "lucide-react";

import type { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";

const projects = [
  {
    name: "Website Redesign",
    team: "Marketing Team",
    status: "IN PROGRESS",
  },
  {
    name: "Mobile App Development",
    team: "Product Team",
    status: "PENDING",
  },
  {
    name: "Q3 Marketing Campaign",
    team: "Marketing Team",
    status: "COMPLETED",
  },
];

const activities = [
  {
    text: "Emma assigned a new task",
    time: "2m ago",
    icon: ClipboardCheck,
  },
  {
    text: "John completed a task",
    time: "15m ago",
    icon: Check,
  },
  {
    text: "Sarah commented on a task",
    time: "1h ago",
    icon: Folder,
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0c0f0b] font-mono text-[#a8b878]">

      {/* CRT scanlines */}
      <div
        className="
          pointer-events-none
          fixed
          inset-0
          z-50
          opacity-[0.025]
          bg-[repeating-linear-gradient(0deg,transparent,transparent_3px,#a8b878_4px)]
        "
      />

      {/* ================= HEADER ================= */}

      <header className="border-b border-[#39442a] bg-[#10140f]">
        <div
          className="
            mx-auto
            flex
            max-w-[1500px]
            items-center
            justify-between
            px-6
            py-4
          "
        >

          {/* Logo */}

          <Link
            to="/"
            className="flex items-center gap-3"
          >
            <div
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                border
                border-[#8fa653]
                text-[#b9d06d]
              "
            >
              <span className="text-xl font-black">
                K
              </span>
            </div>

            <span
              className="
                text-xl
                font-bold
                tracking-[0.25em]
                text-[#b9d06d]
              "
            >
              KAIRO
            </span>
          </Link>

          {/* Signup */}

          <Link
            to="/signup"
            className="
              flex
              items-center
              gap-2
              border
              border-[#b9d06d]
              bg-[#b9d06d]
              px-5
              py-2.5
              text-sm
              font-bold
              tracking-wider
              text-[#10140f]
              transition
              hover:bg-[#d0e98a]
            "
          >
            SIGN UP
            <ArrowRight size={16} />
          </Link>

        </div>
      </header>


      {/* ================= HERO ================= */}

      <main>

        <section
          className="
            relative
            overflow-hidden
            border-b
            border-[#39442a]
            bg-[radial-gradient(circle_at_center,_#172014_0%,_#0c0f0b_65%,_#080a07_100%)]
          "
        >

          {/* Left decorative dots */}

          <div
            className="
              absolute
              left-8
              top-28
              hidden
              grid-cols-5
              gap-3
              opacity-30
              md:grid
            "
          >
            {Array.from({ length: 30 }).map((_, i) => (
              <span
                key={i}
                className="h-1 w-1 bg-[#8fa653]"
              />
            ))}
          </div>


          {/* Right decorative dots */}

          <div
            className="
              absolute
              bottom-24
              right-8
              hidden
              grid-cols-5
              gap-3
              opacity-30
              md:grid
            "
          >
            {Array.from({ length: 30 }).map((_, i) => (
              <span
                key={i}
                className="h-1 w-1 bg-[#8fa653]"
              />
            ))}
          </div>


          {/* Hero content */}

          <div
            className="
              relative
              mx-auto
              max-w-[1100px]
              px-6
              py-20
              text-center
              sm:py-24
            "
          >

            {/* Small label */}

            <div
              className="
                mb-7
                inline-block
                border
                border-[#4c5b34]
                px-4
                py-2
                text-xs
                tracking-[0.25em]
                text-[#8fa653]
              "
            >
              [ BUILT FOR TEAMS THAT BUILD ]
            </div>


            {/* Heading */}

            <h1
              className="
                text-4xl
                font-black
                tracking-widest
                text-[#c4d58b]
                sm:text-6xl
                md:text-7xl
              "
            >
              ORGANIZE WORK.
            </h1>

            <h1
              className="
                mt-2
                text-4xl
                font-black
                tracking-widest
                text-[#8fa653]
                sm:text-6xl
                md:text-7xl
              "
            >
              ACHIEVE MORE.
            </h1>


            {/* Description */}

            <p
              className="
                mx-auto
                mt-8
                max-w-3xl
                text-sm
                leading-7
                text-[#68754d]
                sm:text-base
              "
            >
              Kairo helps teams plan projects, assign tasks,
              collaborate in real-time, and get things done—
              together.
            </p>


            {/* Features */}

            <div
              className="
                mt-12
                grid
                gap-8
                text-left
                sm:grid-cols-2
                lg:grid-cols-4
              "
            >

              <Feature
                icon={Users}
                title="TEAM COLLABORATION"
                description="Work together seamlessly"
              />

              <Feature
                icon={ClipboardCheck}
                title="TASK MANAGEMENT"
                description="Plan, assign, and track"
              />

              <Feature
                icon={Bell}
                title="REAL-TIME UPDATES"
                description="Stay in the loop instantly"
              />

              <Feature
                icon={Terminal}
                title="SMART DASHBOARD"
                description="Everything in one place"
              />

            </div>


            {/* CTA buttons */}

            <div
              className="
                mt-12
                flex
                flex-col
                justify-center
                gap-4
                sm:flex-row
              "
            >

              {/* GET STARTED */}

              <Link
                to="/signup"
                className="
                  flex
                  items-center
                  justify-center
                  gap-3
                  border
                  border-[#c4d58b]
                  bg-[#c4d58b]
                  px-7
                  py-4
                  font-bold
                  tracking-wider
                  text-[#10140f]
                  transition
                  hover:bg-[#d5e79a]
                "
              >
                &gt; GET STARTED FOR FREE

                <ArrowRight size={17} />
              </Link>


              {/* LEARN MORE */}

              <button
                type="button"
                className="
                  flex
                  items-center
                  justify-center
                  gap-3
                  border
                  border-[#4c5b34]
                  px-7
                  py-4
                  font-bold
                  tracking-wider
                  text-[#8fa653]
                  transition
                  hover:border-[#aabd70]
                  hover:text-[#c4d58b]
                "
              >
                LEARN MORE
              </button>

            </div>


            {/* Small CTA text */}

            <p
              className="
                mt-6
                text-xs
                tracking-wider
                text-[#596544]
              "
            >
              [✓] NO CREDIT CARD REQUIRED. FREE FOREVER.
            </p>

          </div>
        </section>


        {/* ================= DASHBOARD PREVIEW ================= */}

        <section
          className="
            mx-auto
            max-w-[1500px]
            px-4
            py-10
            sm:px-6
            sm:py-14
          "
        >

          <div
            className="
              overflow-hidden
              border
              border-[#39442a]
              bg-[#10140f]
              shadow-[0_0_80px_rgba(100,120,60,0.05)]
            "
          >

            {/* Dashboard header */}

            <div
              className="
                flex
                flex-col
                gap-4
                border-b
                border-[#39442a]
                px-5
                py-4
                sm:flex-row
                sm:items-center
                sm:justify-between
              "
            >

              <div className="flex items-center gap-3">

                <div
                  className="
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    border
                    border-[#8fa653]
                    text-[#b9d06d]
                  "
                >
                  <span className="font-black">
                    K
                  </span>
                </div>

                <span
                  className="
                    font-bold
                    tracking-widest
                    text-[#b9d06d]
                  "
                >
                  KAIRO
                </span>

              </div>


              <div className="flex items-center gap-4">

                {/* Search */}

                <div
                  className="
                    hidden
                    items-center
                    gap-2
                    border
                    border-[#39442a]
                    px-4
                    py-2
                    text-xs
                    text-[#596544]
                    sm:flex
                  "
                >
                  <Search size={14} />

                  &gt; SEARCH ANYTHING...
                </div>


                <Bell
                  size={17}
                  className="text-[#68754d]"
                />


                <div
                  className="
                    flex
                    h-8
                    w-8
                    items-center
                    justify-center
                    border
                    border-[#39442a]
                  "
                >
                  <UserRound
                    size={16}
                    className="text-[#8fa653]"
                  />
                </div>

              </div>

            </div>


            {/* Dashboard body */}

            <div className="flex flex-col md:flex-row">


              {/* Sidebar */}

              <aside
                className="
                  w-full
                  border-b
                  border-[#39442a]
                  md:w-64
                  md:border-b-0
                  md:border-r
                "
              >

                <nav className="p-4">

                  <NavItem
                    icon={HomeIcon}
                    text="DASHBOARD"
                    active
                  />

                  <NavItem
                    icon={Folder}
                    text="PROJECTS"
                  />

                  <NavItem
                    icon={ClipboardCheck}
                    text="TASKS"
                  />

                  <NavItem
                    icon={Bell}
                    text="NOTIFICATIONS"
                  />

                  <NavItem
                    icon={Users}
                    text="TEAM"
                  />

                  <NavItem
                    icon={Settings}
                    text="SETTINGS"
                  />

                </nav>

              </aside>


              {/* Dashboard content */}

              <div className="flex-1 p-5">

                <div className="mb-6">

                  <h2
                    className="
                      text-lg
                      font-bold
                      tracking-widest
                      text-[#b9d06d]
                    "
                  >
                    DASHBOARD
                  </h2>

                </div>


                {/* Stats */}

                <div
                  className="
                    grid
                    gap-4
                    sm:grid-cols-2
                    xl:grid-cols-4
                  "
                >

                  <StatCard
                    title="PROJECTS"
                    value="12"
                    subtitle="ACTIVE PROJECTS"
                    icon={Folder}
                  />

                  <StatCard
                    title="TASKS"
                    value="48"
                    subtitle="TASKS IN PROGRESS"
                    icon={ClipboardCheck}
                  />

                  <StatCard
                    title="COMPLETED"
                    value="24"
                    subtitle="TASKS COMPLETED"
                    icon={Check}
                  />

                  <StatCard
                    title="TEAM MEMBERS"
                    value="8"
                    subtitle="ACTIVE MEMBERS"
                    icon={Users}
                  />

                </div>


                {/* Projects + Activity */}

                <div
                  className="
                    mt-5
                    grid
                    gap-5
                    lg:grid-cols-2
                  "
                >

                  {/* Recent projects */}

                  <div
                    className="
                      border
                      border-[#39442a]
                      bg-[#0d110d]
                    "
                  >

                    <div
                      className="
                        border-b
                        border-[#39442a]
                        px-5
                        py-4
                        font-bold
                        tracking-widest
                        text-[#b9d06d]
                      "
                    >
                      RECENT PROJECTS
                    </div>


                    <div className="divide-y divide-[#252d1d]">

                      {projects.map((project) => (
                        <ProjectRow
                          key={project.name}
                          name={project.name}
                          team={project.team}
                          status={project.status}
                        />
                      ))}

                    </div>


                    <div
                      className="
                        px-5
                        py-4
                        text-xs
                        text-[#9daf61]
                      "
                    >
                      &gt; VIEW ALL PROJECTS
                    </div>

                  </div>


                  {/* Recent activity */}

                  <div
                    className="
                      border
                      border-[#39442a]
                      bg-[#0d110d]
                    "
                  >

                    <div
                      className="
                        border-b
                        border-[#39442a]
                        px-5
                        py-4
                        font-bold
                        tracking-widest
                        text-[#b9d06d]
                      "
                    >
                      RECENT ACTIVITY
                    </div>


                    <div className="divide-y divide-[#252d1d]">

                      {activities.map((activity) => {

                        const Icon = activity.icon;

                        return (
                          <div
                            key={activity.text}
                            className="
                              flex
                              gap-4
                              px-5
                              py-4
                            "
                          >

                            <div
                              className="
                                flex
                                h-8
                                w-8
                                shrink-0
                                items-center
                                justify-center
                                border
                                border-[#4c5b34]
                                text-[#8fa653]
                              "
                            >
                              <Icon size={15} />
                            </div>


                            <div>

                              <p
                                className="
                                  text-sm
                                  text-[#9daf61]
                                "
                              >
                                {activity.text}
                              </p>

                              <p
                                className="
                                  mt-1
                                  text-xs
                                  text-[#596544]
                                "
                              >
                                {activity.time}
                              </p>

                            </div>

                          </div>
                        );
                      })}

                    </div>


                    <div
                      className="
                        px-5
                        py-4
                        text-xs
                        text-[#9daf61]
                      "
                    >
                      &gt; VIEW ALL ACTIVITY
                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </section>

      </main>

    </div>
  );
}


/* ================================================= */
/* FEATURE */
/* ================================================= */

function Feature({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-4">

      <div
        className="
          flex
          h-12
          w-12
          shrink-0
          items-center
          justify-center
          border
          border-[#4c5b34]
          text-[#aabd70]
        "
      >
        <Icon size={22} />
      </div>


      <div>

        <h3
          className="
            text-sm
            font-bold
            tracking-wider
            text-[#aabd70]
          "
        >
          {title}
        </h3>

        <p
          className="
            mt-1
            text-xs
            leading-5
            text-[#596544]
          "
        >
          {description}
        </p>

      </div>

    </div>
  );
}


/* ================================================= */
/* NAV ITEM */
/* ================================================= */

function NavItem({
  icon: Icon,
  text,
  active = false,
}: {
  icon: LucideIcon;
  text: string;
  active?: boolean;
}) {
  return (
    <div
      className={`
        mb-2
        flex
        items-center
        gap-3
        px-4
        py-3
        text-xs
        font-bold
        tracking-wider
        transition
        ${
          active
            ? "border border-[#7f9449] bg-[#29321e] text-[#c4d58b]"
            : "text-[#68754d] hover:bg-[#151b12] hover:text-[#aabd70]"
        }
      `}
    >

      <Icon size={17} />

      {text}

    </div>
  );
}


/* ================================================= */
/* STAT CARD */
/* ================================================= */

function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: LucideIcon;
}) {
  return (
    <div
      className="
        border
        border-[#39442a]
        bg-[#0d110d]
        p-5
      "
    >

      <div className="flex items-start justify-between">

        <div>

          <p
            className="
              text-xs
              tracking-widest
              text-[#596544]
            "
          >
            {title}
          </p>


          <p
            className="
              mt-2
              text-3xl
              font-black
              text-[#b9d06d]
            "
          >
            {value}
          </p>


          <p
            className="
              mt-2
              text-[10px]
              tracking-wider
              text-[#596544]
            "
          >
            {subtitle}
          </p>

        </div>


        <div
          className="
            flex
            h-10
            w-10
            items-center
            justify-center
            border
            border-[#4c5b34]
            text-[#8fa653]
          "
        >
          <Icon size={22} />
        </div>

      </div>

    </div>
  );
}


/* ================================================= */
/* PROJECT ROW */
/* ================================================= */

function ProjectRow({
  name,
  team,
  status,
}: {
  name: string;
  team: string;
  status: string;
}) {

  const statusColor =
    status === "COMPLETED"
      ? "text-[#b9d06d]"
      : status === "PENDING"
        ? "text-[#d2a84e]"
        : "text-[#8fa653]";

  return (
    <div
      className="
        flex
        items-center
        justify-between
        gap-4
        px-5
        py-4
      "
    >

      <div
        className="
          flex
          min-w-0
          items-center
          gap-3
        "
      >

        <div
          className="
            flex
            h-8
            w-8
            shrink-0
            items-center
            justify-center
            border
            border-[#4c5b34]
            text-[#8fa653]
          "
        >
          <Folder size={15} />
        </div>


        <div className="min-w-0">

          <p
            className="
              truncate
              text-sm
              text-[#9daf61]
            "
          >
            {name}
          </p>

          <p
            className="
              mt-1
              text-xs
              text-[#596544]
            "
          >
            {team}
          </p>

        </div>

      </div>


      <span
        className={`
          shrink-0
          text-[10px]
          font-bold
          tracking-wider
          ${statusColor}
        `}
      >
        {status}
      </span>

    </div>
  );
}