const RoadmapIcon = () =>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    style={{ transform: "rotate(90deg)" }}
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    class="subdomainHomeIcon"
  >
    <line x1="18" x2="18" y1="20" y2="10" />
    <line x1="12" x2="12" y1="20" y2="4" />
    <line x1="6" x2="6" y1="20" y2="14" />
  </svg>;
const FeatureIcon = () =>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    class="subdomainHomeIcon"
  >
    <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
    <path d="M9 18h6" />
    <path d="M10 22h4" />
  </svg>;
const ChangeLogIcon = () =>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    class="subdomainHomeIcon"
  >
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    <path d="M5 3v4" />
    <path d="M19 17v4" />
    <path d="M3 5h4" />
    <path d="M17 19h4" />
  </svg>;

const GoogleIcon = () =>
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M18.1716 8.36775H17.5003V8.33317H10.0003V11.6665H14.7099C14.0228 13.6069 12.1766 14.9998 10.0003 14.9998C7.23908 14.9998 5.00033 12.7611 5.00033 9.99984C5.00033 7.23859 7.23908 4.99984 10.0003 4.99984C11.2749 4.99984 12.4345 5.48067 13.3174 6.26609L15.6745 3.909C14.1862 2.52192 12.1953 1.6665 10.0003 1.6665C5.39824 1.6665 1.66699 5.39775 1.66699 9.99984C1.66699 14.6019 5.39824 18.3332 10.0003 18.3332C14.6024 18.3332 18.3337 14.6019 18.3337 9.99984C18.3337 9.44109 18.2762 8.89567 18.1716 8.36775Z"
      fill="#FFC107"
    />
    <path
      d="M2.62793 6.12109L5.36585 8.129C6.10668 6.29484 7.90085 4.99984 10.0004 4.99984C11.275 4.99984 12.4346 5.48067 13.3175 6.26609L15.6746 3.909C14.1863 2.52192 12.1954 1.6665 10.0004 1.6665C6.7996 1.6665 4.02376 3.47359 2.62793 6.12109Z"
      fill="#FF3D00"
    />
    <path
      d="M9.99981 18.3331C12.1523 18.3331 14.1081 17.5094 15.5869 16.1698L13.0077 13.9873C12.1429 14.645 11.0862 15.0007 9.99981 14.9998C7.83231 14.9998 5.99189 13.6177 5.29855 11.689L2.58105 13.7827C3.96022 16.4815 6.76106 18.3331 9.99981 18.3331Z"
      fill="#4CAF50"
    />
    <path
      d="M18.1713 8.36808H17.5V8.3335H10V11.6668H14.7096C14.3809 12.5903 13.7889 13.3973 13.0067 13.9881L13.0079 13.9872L15.5871 16.1697C15.4046 16.3356 18.3333 14.1668 18.3333 10.0002C18.3333 9.44141 18.2758 8.896 18.1713 8.36808Z"
      fill="#1976D2"
    />
  </svg>;

const ArrowIcon = () =>
  <svg
    width="10"
    height="6"
    viewBox="0 0 10 6"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M1 1L5 5L9 1"
      stroke="#CCCCCC"
      stroke-width="1.2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>;

export { ArrowIcon, ChangeLogIcon, FeatureIcon, RoadmapIcon, GoogleIcon };
