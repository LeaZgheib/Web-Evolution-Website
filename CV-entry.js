document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("cvForm");
  const preview = document.getElementById("cvPreview");
  const lastUpdated = document.getElementById("lastUpdated");

  lastUpdated.textContent = new Date().toLocaleDateString();

  // -----------------------------
  // Add / Remove dynamic fields
  // -----------------------------
  function addField(sectionId, placeholders, groupClass) {
    const section = document.getElementById(sectionId);
    const div = document.createElement("div");
    div.className = groupClass + " group-row";
    div.innerHTML = placeholders.map(p => `<input type="text" name="${p.name}" placeholder="${p.placeholder}">`).join("");
    const removeBtn = document.createElement("button");
    removeBtn.type = "button";
    removeBtn.textContent = "Remove";
    removeBtn.className = "removeBtn";
    removeBtn.addEventListener("click", () => div.remove());
    div.appendChild(removeBtn);
    section.insertBefore(div, section.querySelector("button"));
  }

  document.getElementById("addEducation").addEventListener("click", () => {
    addField("educationSection", [
      {name:"degree[]", placeholder:"Degree"},
      {name:"institution[]", placeholder:"Institution"},
      {name:"year[]", placeholder:"Year"}
    ], "edu-group");
  });

  document.getElementById("addExperience").addEventListener("click", () => {
    addField("experienceSection", [
      {name:"jobTitle[]", placeholder:"Job Title"},
      {name:"company[]", placeholder:"Company"},
      {name:"dates[]", placeholder:"Dates"}
    ], "exp-group");
  });

  document.getElementById("addSkill").addEventListener("click", () => {
    addField("skillsSection", [{name:"skills[]", placeholder:"Skill"}], "skill-group");
  });

  document.getElementById("addProject").addEventListener("click", () => {
    addField("projectsSection", [{name:"projects[]", placeholder:"Project / Certification"}], "proj-group");
  });

  // -----------------------------
  // Form submission & preview
  // -----------------------------
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const data = {
      fullName: form.fullName.value,
      email: form.email.value,
      phone: form.phone.value,
      bio: form.bio.value,
      education: Array.from(form.querySelectorAll('.edu-group')).map(g => {
        return {
          degree: g.querySelector('input[name="degree[]"]')?.value || '',
          institution: g.querySelector('input[name="institution[]"]')?.value || '',
          year: g.querySelector('input[name="year[]"]')?.value || ''
        };
      }).filter(e => e.degree || e.institution || e.year),
      experience: Array.from(form.querySelectorAll('.exp-group')).map(g => {
        return {
          jobTitle: g.querySelector('input[name="jobTitle[]"]')?.value || '',
          company: g.querySelector('input[name="company[]"]')?.value || '',
          dates: g.querySelector('input[name="dates[]"]')?.value || ''
        };
      }).filter(e => e.jobTitle || e.company || e.dates),
      skills: Array.from(form.querySelectorAll('input[name="skills[]"]')).map(i => i.value).filter(Boolean),
      projects: Array.from(form.querySelectorAll('input[name="projects[]"]')).map(i => i.value).filter(Boolean)
    };

    renderCV(data);
  });

  function renderCV(data) {
    preview.innerHTML = `
      <h3>${data.fullName}</h3>
      <p>Email: ${data.email} | Phone: ${data.phone}</p>
      <p>${data.bio}</p>

      ${data.education.length ? `<h4>Education</h4><ul>${data.education.map(e => `<li>${e.degree} — ${e.institution} (${e.year})</li>`).join("")}</ul>` : ""}
      ${data.experience.length ? `<h4>Experience</h4><ul>${data.experience.map(e => `<li>${e.jobTitle} — ${e.company} (${e.dates})</li>`).join("")}</ul>` : ""}
      ${data.skills.length ? `<h4>Skills</h4><ul>${data.skills.map(s => `<li>${s}</li>`).join("")}</ul>` : ""}
      ${data.projects.length ? `<h4>Projects / Certifications</h4><ul>${data.projects.map(p => `<li>${p}</li>`).join("")}</ul>` : ""}
    `;
  }

  // -----------------------------
  // PDF download using html2canvas
  // -----------------------------
  document.getElementById("downloadPdf").addEventListener("click", () => {
    html2canvas(preview).then(canvas => {
      const imgData = canvas.toDataURL("image/png");
      const { jsPDF } = window.jspdf;
      const pdf = new jsPDF("p", "mm", "a4");
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth() - 20;
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, "PNG", 10, 10, pdfWidth, pdfHeight);
      pdf.save("my-cv.pdf");
    });
  });
});




