/* ––– TemplatePreview.jsx –––
 * Renders a pixel-accurate email preview for each template.
 * Used both as a "thumbnail" (scaled down) in the selection grid
 * and as the full live-preview pane on the right side of the editor.
 */

const EMAIL_WIDTH = 520;

function EmailWrapper({ headerBg, children }) {
  return (
    <div
      style={{
        width: EMAIL_WIDTH,
        fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
        backgroundColor: "#f4f4f4",
        padding: "20px 0",
        minHeight: 600,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: EMAIL_WIDTH,
          backgroundColor: "#ffffff",
          borderRadius: 12,
          overflow: "hidden",
          boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
        }}
      >
        {/* Header */}
        <div
          style={{
            background: headerBg,
            padding: "32px 36px 28px",
            textAlign: "center",
          }}
        >
          <p
            style={{
              margin: 0,
              color: "rgba(255,255,255,0.85)",
              fontSize: 13,
              letterSpacing: 1,
              textTransform: "uppercase",
            }}
          >
            {children.businessName || "Your Laundry"}
          </p>
        </div>

        {/* Body */}
        <div style={{ padding: "32px 36px" }}>{children.body}</div>

        {/* Footer */}
        <div
          style={{
            borderTop: "1px solid #eeeeee",
            padding: "20px 36px",
            textAlign: "center",
            backgroundColor: "#fafafa",
          }}
        >
          <p style={{ margin: 0, color: "#999999", fontSize: 11 }}>
            © {new Date().getFullYear()}{" "}
            {children.businessName || "Your Laundry"} · All rights reserved
          </p>
          <p style={{ margin: "4px 0 0", color: "#bbbbbb", fontSize: 10 }}>
            You received this email because you are a valued customer.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ── Greeting line ── */
function Greeting({ customerName }) {
  return (
    <p style={{ margin: "0 0 18px", color: "#555555", fontSize: 14 }}>
      Hi <strong>{customerName || "{Customer Name}"}</strong>,
    </p>
  );
}

/* ── CTA Button ── */
function CTAButton({ text, color }) {
  return (
    <div style={{ textAlign: "center", margin: "28px 0 4px" }}>
      <span
        style={{
          display: "inline-block",
          backgroundColor: color,
          color: "#ffffff",
          padding: "12px 32px",
          borderRadius: 8,
          fontSize: 14,
          fontWeight: 600,
          textDecoration: "none",
          cursor: "default",
        }}
      >
        {text || "Click Here"}
      </span>
    </div>
  );
}

/* ────────────────────────────────────────────────
   TEMPLATE 1 — Welcome Back
   ──────────────────────────────────────────────── */
function WelcomeBackPreview({ content, businessName }) {
  return (
    <EmailWrapper
      accentColor="#008aff"
      headerBg="linear-gradient(135deg, #008aff 0%, #0066cc 100%)"
    >
      {{
        businessName,
        body: (
          <>
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <div style={{ fontSize: 48 }}>👋</div>
            </div>
            <Greeting customerName="{Customer Name}" />
            <h2
              style={{
                margin: "0 0 16px",
                color: "#1a1a2e",
                fontSize: 22,
                fontWeight: 700,
                lineHeight: 1.3,
              }}
            >
              {content.title || "We Miss You!"}
            </h2>
            <p
              style={{
                margin: "0 0 8px",
                color: "#555555",
                fontSize: 14,
                lineHeight: 1.7,
              }}
            >
              {content.message ||
                "It's been a while since we last saw you. Come back and let us take care of your laundry."}
            </p>
            <CTAButton
              text={content.buttonText || "Book Now"}
              color="#008aff"
            />
          </>
        ),
      }}
    </EmailWrapper>
  );
}

/* ────────────────────────────────────────────────
   TEMPLATE 2 — Special Offer
   ──────────────────────────────────────────────── */
function SpecialOfferPreview({ content, businessName }) {
  return (
    <EmailWrapper
      accentColor="#f59e0b"
      headerBg="linear-gradient(135deg, #f59e0b 0%, #d97706 100%)"
    >
      {{
        businessName,
        body: (
          <>
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 88,
                  height: 88,
                  borderRadius: "50%",
                  backgroundColor: "#fff8e7",
                  border: "3px solid #f59e0b",
                  fontSize: 22,
                  fontWeight: 800,
                  color: "#d97706",
                  lineHeight: 1,
                }}
              >
                {content.offerBadge || "20% OFF"}
              </div>
            </div>
            <Greeting customerName="{Customer Name}" />
            <h2
              style={{
                margin: "0 0 16px",
                color: "#1a1a2e",
                fontSize: 22,
                fontWeight: 700,
                lineHeight: 1.3,
              }}
            >
              {content.title || "A Special Deal, Just for You!"}
            </h2>
            <p
              style={{
                margin: "0 0 8px",
                color: "#555555",
                fontSize: 14,
                lineHeight: 1.7,
              }}
            >
              {content.message ||
                "Enjoy this exclusive discount on your next laundry order. Valid for a limited time only."}
            </p>
            <CTAButton
              text={content.buttonText || "Claim Offer"}
              color="#f59e0b"
            />
          </>
        ),
      }}
    </EmailWrapper>
  );
}

/* ────────────────────────────────────────────────
   TEMPLATE 3 — Seasonal Campaign
   ──────────────────────────────────────────────── */
function SeasonalPreview({ content, businessName }) {
  return (
    <EmailWrapper
      accentColor="#10b981"
      headerBg="linear-gradient(135deg, #10b981 0%, #059669 100%)"
    >
      {{
        businessName,
        body: (
          <>
            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <span
                style={{
                  display: "inline-block",
                  backgroundColor: "#ecfdf5",
                  color: "#059669",
                  borderRadius: 20,
                  padding: "6px 18px",
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: 0.5,
                  textTransform: "uppercase",
                }}
              >
                🌿 &nbsp;{content.season || "This Season"}
              </span>
            </div>
            <Greeting customerName="{Customer Name}" />
            <h2
              style={{
                margin: "0 0 16px",
                color: "#1a1a2e",
                fontSize: 22,
                fontWeight: 700,
                lineHeight: 1.3,
              }}
            >
              {content.title || "Fresh Start This Season!"}
            </h2>
            <p
              style={{
                margin: "0 0 8px",
                color: "#555555",
                fontSize: 14,
                lineHeight: 1.7,
              }}
            >
              {content.message ||
                "Let us handle your seasonal cleaning needs. From duvets to curtains – we've got you covered."}
            </p>
            <CTAButton
              text={content.buttonText || "Book Now"}
              color="#10b981"
            />
          </>
        ),
      }}
    </EmailWrapper>
  );
}

/* ────────────────────────────────────────────────
   TEMPLATE 4 — Order Ready
   ──────────────────────────────────────────────── */
function OrderReadyPreview({ content, businessName }) {
  return (
    <EmailWrapper
      accentColor="#8b5cf6"
      headerBg="linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)"
    >
      {{
        businessName,
        body: (
          <>
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 64,
                  height: 64,
                  borderRadius: "50%",
                  backgroundColor: "#f5f3ff",
                  fontSize: 30,
                }}
              >
                ✅
              </div>
            </div>
            <Greeting customerName="{Customer Name}" />
            <h2
              style={{
                margin: "0 0 16px",
                color: "#1a1a2e",
                fontSize: 22,
                fontWeight: 700,
                lineHeight: 1.3,
              }}
            >
              {content.title || "Your Order is Ready!"}
            </h2>
            <p
              style={{
                margin: "0 0 16px",
                color: "#555555",
                fontSize: 14,
                lineHeight: 1.7,
              }}
            >
              {content.message ||
                "Great news! Your laundry is clean, pressed, and ready for pickup."}
            </p>
            {content.pickupNote && (
              <div
                style={{
                  backgroundColor: "#f5f3ff",
                  border: "1px solid #ddd6fe",
                  borderRadius: 8,
                  padding: "12px 16px",
                  marginBottom: 8,
                }}
              >
                <p style={{ margin: 0, color: "#6d28d9", fontSize: 13 }}>
                  ℹ️ &nbsp;{content.pickupNote}
                </p>
              </div>
            )}
            <CTAButton
              text={content.buttonText || "View Order"}
              color="#8b5cf6"
            />
          </>
        ),
      }}
    </EmailWrapper>
  );
}

/* ────────────────────────────────────────────────
   TEMPLATE 5 — Loyalty Reward
   ──────────────────────────────────────────────── */
function LoyaltyPreview({ content, businessName }) {
  return (
    <EmailWrapper
      accentColor="#f43f5e"
      headerBg="linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)"
    >
      {{
        businessName,
        body: (
          <>
            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <div style={{ fontSize: 44 }}>⭐</div>
            </div>
            <Greeting customerName="{Customer Name}" />
            <h2
              style={{
                margin: "0 0 16px",
                color: "#1a1a2e",
                fontSize: 22,
                fontWeight: 700,
                lineHeight: 1.3,
              }}
            >
              {content.title || "You're Amazing!"}
            </h2>
            <p
              style={{
                margin: "0 0 16px",
                color: "#555555",
                fontSize: 14,
                lineHeight: 1.7,
              }}
            >
              {content.message ||
                "You're one of our most valued customers. As a token of our appreciation, we have a special reward just for you."}
            </p>
            {content.reward && (
              <div
                style={{
                  textAlign: "center",
                  margin: "4px 0 8px",
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    backgroundColor: "#fff1f2",
                    border: "2px dashed #f43f5e",
                    borderRadius: 10,
                    padding: "14px 28px",
                    color: "#e11d48",
                    fontWeight: 700,
                    fontSize: 15,
                  }}
                >
                  🎁 &nbsp;{content.reward}
                </span>
              </div>
            )}
            <CTAButton
              text={content.buttonText || "Redeem Reward"}
              color="#f43f5e"
            />
          </>
        ),
      }}
    </EmailWrapper>
  );
}

/* ────────────────────────────────────────────────
   TEMPLATE 6 — Custom (user-built)
   ──────────────────────────────────────────────── */
function CustomPreview({ content, businessName }) {
  const color = content.accentColor || "#008aff";
  const darken = color + "cc";
  const headerBg = `linear-gradient(135deg, ${color} 0%, ${darken} 100%)`;
  return (
    <EmailWrapper headerBg={headerBg}>
      {{
        businessName,
        body: (
          <>
            <Greeting customerName="{Customer Name}" />
            <h2
              style={{
                margin: "0 0 16px",
                color: "#1a1a2e",
                fontSize: 22,
                fontWeight: 700,
                lineHeight: 1.3,
              }}
            >
              {content.title || "Your Headline Here"}
            </h2>
            <p
              style={{
                margin: "0 0 8px",
                color: "#555555",
                fontSize: 14,
                lineHeight: 1.7,
              }}
            >
              {content.message ||
                "Your message content will appear here. Start writing to see a live preview."}
            </p>
            <CTAButton
              text={content.buttonText || "Contact Us"}
              color={color}
            />
          </>
        ),
      }}
    </EmailWrapper>
  );
}

/* ────────────────────────────────────────────────
   Main export: TemplatePreview
   ──────────────────────────────────────────────── */
const TEMPLATE_COMPONENTS = {
  welcome_back: WelcomeBackPreview,
  special_offer: SpecialOfferPreview,
  seasonal: SeasonalPreview,
  order_ready: OrderReadyPreview,
  loyalty: LoyaltyPreview,
  custom: CustomPreview,
};

/**
 * @param {object} props
 * @param {string}  props.templateId   - one of the 5 template ids
 * @param {object}  props.content      - editable field values
 * @param {string}  props.businessName - laundry name
 * @param {boolean} [props.thumbnail]  - render as a small scaled thumbnail
 */
export default function TemplatePreview({
  templateId,
  content,
  businessName,
  thumbnail = false,
}) {
  const Component = TEMPLATE_COMPONENTS[templateId];
  if (!Component) return null;

  if (thumbnail) {
    const SCALE = 0.27;
    return (
      <div
        style={{
          width: EMAIL_WIDTH * SCALE,
          height: 160,
          overflow: "hidden",
          borderRadius: 6,
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            transform: `scale(${SCALE})`,
            transformOrigin: "top left",
            width: EMAIL_WIDTH,
          }}
        >
          <Component content={content} businessName={businessName} />
        </div>
      </div>
    );
  }

  /* Full preview — responsive scale so it always fits the panel */
  return (
    <div style={{ overflowX: "auto" }}>
      <Component content={content} businessName={businessName} />
    </div>
  );
}
