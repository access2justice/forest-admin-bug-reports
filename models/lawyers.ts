import Mongoose from 'mongoose';

interface LawyersInterface {
  // savId: string;
  hidden: boolean;
  firstName: string;
  lastName: string;
  title: string;
  yearOfBirth: string;
  gender: string;
  lawyerAdmissionYear: string;
  email: string;
  phone: string;
  lawyerAdmissionCanton: string;
  lawyerRegistryCanton: string;
  // preferredContact: string;
  firmFunction: string;
  // euefta: boolean;
  mediator: boolean;
  memberships: Array<string>;
  slug: string;
  available: boolean;
  // associationMembershipActive: boolean;
  // lawAssociation: string;
  hasFirstConsultation: boolean;
  firstConsultationDuration: string;
  hasHourlyRate: boolean;
  hourlyRate: string;
  hideAge: boolean;
  signUpStatus: string;
  languages: Array<{
    value: {
      lang: string;
      kind: string;
    };
  }>;
  profileText: {
    manual: string;
    generated: string;
  };
  profileTextSelection: string;
  practiceAreas: Array<{
    value: {
      practiceArea: {
        link: string;
        display: string;
      };
      preference: number;
    };
  }>;
  // notaryship: boolean;
  // notarAdmissionYear: string;
  // notarAdmissionCanton: string;
  // lawAssociationMembershipDate: string;
  // generalConsulting: boolean;
  // litigating: boolean;
  // consulting: boolean;
  accountType: string;
  // subscriptionPeriod: string;
  showClientMessageInEmail: boolean;
  billing: {
    commission: {
      percentage: string;
      cap?: string;
    };
    subscription: {
      invoiceChannel: string;
      stripeSubscriptionId: string;
      freeTrial: boolean;
    };
    stripeCustomerId: string;
    bexioContactId: number;
    stripeSubscriptionId: string;
  };
  education: Array<{
    value: {
      title: string;
      university: string;
      date: string;
      __typename: string;
    };
  }>;
  experience: Array<{
    value: {
      from: object;
      to: object;
      function: string;
      office: string;
    };
  }>;
  publications: Array<{
    value: {
      title: string;
      publication: string;
      link: string;
    };
  }>;
  // lastContacted: string;
  // subscriptionPrice: string;
  showContactData: boolean;
  firstConsultationPrice: string;
  termsOfUseAccepted: string;
  specialCertificates: Array<string>;
  poolClaimTemplate: string;
}

const LawyersSchema = new Mongoose.Schema(
  {
    // savId: String,
    hidden: { type: Boolean, required: true, default: false },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    title: { type: String, default: '' },
    yearOfBirth: { type: String, default: '' },
    gender: { type: String, required: true },
    lawyerAdmissionYear: String,
    email: { type: String, required: true },
    phone: { type: String, default: '' },
    lawyerAdmissionCanton: { type: String, default: '' },
    lawyerRegistryCanton: { type: String, default: '' },
    // preferredContact: { type: String, required: true, default: 'message' },
    firmFunction: { type: String, default: '' },
    // euefta: { type: Boolean, required: true, default: false },
    mediator: { type: Boolean, required: true, default: false },
    memberships: { type: [String], required: true, default: [] },
    slug: String,
    available: { type: Boolean, required: true, default: true },
    // associationMembershipActive: { type: Boolean, required: true, default: true },
    // lawAssociation: { type: String, default: '' },
    hasFirstConsultation: { type: Boolean, required: true, default: false },
    firstConsultationDuration: { type: String, default: '15' },
    hasHourlyRate: { type: Boolean, required: true, default: false },
    hourlyRate: { type: String, default: '' },
    hideAge: { type: Boolean, required: true, default: false },
    signUpStatus: { type: String, required: true, default: 'unclaimed' },
    languages: {
      type: [
        {
          value: {
            lang: String,
            kind: String,
          },
          _id: false,
        },
      ],
      required: true,
      default: [],
    },
    profileText: {
      type: {
        manual: String,
        generated: String,
        _id: false,
      },
      required: true,
      default: {
        manual: '',
        generated: '',
      },
    },
    profileTextSelection: { type: String, required: true, default: 'generated' },
    practiceAreas: {
      type: [
        {
          value: {
            practiceArea: {
              link: { type: String, required: true, default: 'practiceAreas' },
              display: { type: String, required: true },
              _id: { type: String, required: true },
            },
            preference: Number,
          },
          _id: false,
        },
      ],
      required: true,
      default: [],
    },
    // notaryship: { type: Boolean, required: true, default: false },
    // notarAdmissionYear: { type: String, default: '' },
    // notarAdmissionCanton: { type: String, default: '' },
    // lawAssociationMembershipDate: { type: String, default: '' },
    // generalConsulting: { type: Boolean, required: true, default: false },
    // litigating: { type: Boolean, required: true, default: false },
    // consulting: { type: Boolean, required: true, default: false },
    accountType: { type: String, required: true, default: 'Free' },
    // subscriptionPeriod: { type: String, required: true, default: 'Month' },
    showClientMessageInEmail: { type: Boolean, required: true, default: false },
    billing: {
      type: {
        commission: {
          percentage: String,
          cap: String,
        },
        subscription: {
          invoiceChannel: String,
          stripeSubscriptionId: String,
          freeTrial: Boolean,
        },
        stripeCustomerId: String,
        bexioContactId: Number,
        _id: false,
      },
      required: true,
      default: {
        commission: {
          percentage: '10',
        },
        subscription: {
          invoiceChannel: 'bexio',
          freeTrial: false,
        },
      },
    },
    education: [
      {
        value: {
          title: { type: String, required: true },
          university: { type: String, required: true },
          date: { type: String, required: true },
        },
        _id: false,
      },
    ],
    experience: [
      {
        value: {
          from: { type: String, required: true },
          to: { type: String, required: true },
          function: { type: String, required: true },
          office: { type: String, required: true },
        },
        _id: false,
      },
    ],
    publications: [
      {
        value: {
          title: { type: String, required: true },
          publication: { type: String, required: true },
          link: { type: String, required: false },
        },
        _id: false,
      },
    ],
    // lastContacted: { type: String, default: '' },
    // subscriptionPrice: { type: String, required: true, default: '0' },
    showContactData: { type: Boolean, default: true },
    firstConsultationPrice: { type: String, default: '' },
    termsOfUseAccepted: { type: String, default: '' },
    specialCertificates: {
      type: [String],
      required: true,
      default: [],
    },
    poolClaimTemplate: { type: String, default: '' },
    awards: {
      type: [String],
      required: true,
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export { LawyersInterface, LawyersSchema };
