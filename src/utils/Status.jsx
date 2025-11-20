const descriptions = {
  PRE_TRANSIT: {
    substatus: {
      information_received: {
        description:
          "The carrier has received the necessary details about your package.",
      },
    },
    // The label is created but before the package is dropped off or picked up by the carrier.
    description:
      "The label is created but the package is not with the carrier.",
    bg: "#E0FFFC",
    pin: "#009688",
  },
  TRANSIT: {
    substatus: {
      address_issue: {
        description: "Address information is incorrect. Contact support.",
      },
      contact_carrier: {
        description: "Additional information is needed. Contact support.",
      },
      delayed: {
        description: "Unexpected event occurred that may delay the delivery.",
      },
      delivery_attempted: {
        description:
          "Carrier tried to deliver package but was unable to complete the delivery.",
      },
      delivery_rescheduled: {
        description: "Delivery of package has been rescheduled.",
      },
      delivery_scheduled: {
        description: "Package is scheduled for delivery.",
      },
      location_inaccessible: {
        description:
          "Delivery location inaccessible to carrier. Contact support.",
      },
      notice_left: {
        description:
          "Carrier left notice during attempted delivery. Follow carrier instructions on notice.",
      },
      out_for_delivery: {
        description: "Package is out for delivery.",
      },
      package_accepted: {
        description:
          "Package has been accepted into the carrier network for delivery.",
      },
      package_arrived: {
        description:
          "Package has arrived at an intermediate location in the carrier network.",
      },
      package_damaged: {
        description:
          "Package has been damaged. Contact carrier for more details.",
      },
      package_departed: {
        description:
          "Package has departed from an intermediate location in the carrier network.",
      },
      package_forwarded: {
        description: "Package has been forwarded.",
      },
      package_held: {
        description:
          "Package held at carrier location. Contact carrier for more details.",
      },
      package_processed: {
        description: "Package has been processed at an intermediate location.",
      },
      package_processing: {
        description:
          "Package is processing at an intermediate location in the carrier network.",
      },
      pickup_available: {
        description: "Package is available for pickup at carrier location.",
      },
      reschedule_delivery: {
        description: "Contact carrier to reschedule delivery.",
      },
    },
    description:
      "The package has been scanned by the carrier and is in transit.",
    bg: "#DCF1FF",
    pin: "#47B4FF",
  },
  DELIVERED: {
    description: "The package has been successfully delivered.",
    bg: "#F0FFF4",
    pin: "#0CCF43",
  },
  RETURNED: {
    substatus: {
      returntosender: {
        description: "Package is to be returned to sender.",
      },
      package_unclaimed: {
        description: "Package is unclaimed.",
      },
    },
    description:
      "The package is en route to be returned to the sender, or has been returned successfully.",
    bg: "#FFF7E6",
    pin: "#FBBD40",
  },
  FAILURE: {
    substatus: {
      package_undeliverable: {
        description: "Package is not able to be delivered.",
      },
      package_disposed: {
        description: "Package has been disposed.",
      },
      package_lost: {
        description: "Package has been lost. Contact support for more details.",
      },
    },
    description:
      "The carrier indicated that there has been an issue with the delivery.",
    bg: "#FFE8EA",
    pin: "#BE1C2D",
  },
  UNKNOWN: {
    description: "Carrier has no information about this shipment",
    bg: "#F0F0F0",
    pin: "#607D8B",
  },
};

export default function Status({ name, sub, last }) {
  function getStatusInfo(status, substatus = null) {
    const entry = descriptions[status];
    if (!entry) return null;

    if (substatus && entry.substatus) {
      const sub = entry.substatus[substatus];
      if (!sub) return null;
      return {
        status,
        substatus,
        description: sub.description,
        bg: entry.bg,
        pin: entry.pin,
      };
    }

    return {
      status,
      description: entry.description,
      bg: entry.bg,
      pin: entry.pin,
    };
  }
  const statusInfo = getStatusInfo(name.toUpperCase(), sub?.toLowerCase());

  return (
    <div className="relative group">
      <div
        className={`bg-[${statusInfo?.bg}] ${
          !Object.keys(descriptions).includes(name) && "bg-[#F3F5F7] "
        } px-2 py-1 w-fit rounded-lg flex flex-col gap-1`}
      >
        <span
          className={`flex items-center gap-1 capitalize whitespace-nowrap text-xs text-[#212121]`}
        >
          <span
            className={`bg-[${statusInfo?.pin}] ${
              !Object.keys(descriptions).includes(name) && "bg-[#959595]"
            } rounded-[50%] flex w-3 h-3`}
          ></span>
          {name}
        </span>
        {sub && (
          <span className="text-[10px]">
            {sub === "contact_carrier" ? "contact_support" : sub}
          </span>
        )}
      </div>
      <div
        className={`absolute group-hover:block hidden left-0 right-0 z-10 bg-white border border-[#E7E7E7] rounded-[10px] p-2 animate-in fade-in slide-in-from-top-4 duration-300 md:w-[200%] -translate-x-[10%] ${
          last ? "bottom-6 mb-3" : "top-full mt-3"
        }
       `}
      >
        {last ? (
          <div
            className={`absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white border-[#E7E7E7] border-b border-r rotate-45 md:left-1/4`}
          ></div>
        ) : (
          <div
            className={`absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white border-[#E7E7E7] border-t border-l rotate-45 md:left-1/4`}
          ></div>
        )}
        <p className="text-xs text-black">
          {statusInfo?.description || "No description available."}
        </p>
      </div>
    </div>
  );
}
