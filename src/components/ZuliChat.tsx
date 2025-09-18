import React, { useMemo, useState } from "react";
import { IoChatbubblesOutline, IoClose } from "react-icons/io5";

/** ---------- Types ---------- */
type Message = {
  id: string;
  from: "bot" | "user";
  text: string;
};

type GuidedSelection = {
  brand?: string;
  category?: string;
  product?: string;
  size?: string;
};

type SizeInfo = { price: number; stock: string };
type ProductEntry = { sizes: Record<string, SizeInfo> };
type GuidedCatalog = Record<
  string,
  Record<string, Record<string, ProductEntry>>
>;

type OrderSnapshot = {
  customer: string;
  status: string;
  items: string[];
  eta: string;
  trackingNumber: string;
};

export type ZuliChatProps = {
  triggerText?: string;
  placement?: "bottom-right" | "bottom-left";
  offset?: { bottom?: number; right?: number; left?: number };
  initialOpen?: boolean;
  title?: string;
  subtitle?: string;
  theme?: "light" | "dark";
};

const ZuliChat: React.FC<ZuliChatProps> = ({
  triggerText = "Ask Zuli",
  placement = "bottom-right",
  offset,
  initialOpen = false,
  title = "Zuli Concierge",
  subtitle = "Malaysia — Tower 3, Kuala Lumpur",
  theme = "light",
}) => {
  const [isChatOpen, setIsChatOpen] = useState(initialOpen);
  const [messages, setMessages] = useState<Message[]>([]);
  const [mode, setMode] = useState<"menu" | "faq" | "guided" | "orders">(
    "menu"
  );
  const [guidedSelection, setGuidedSelection] = useState<GuidedSelection>({});
  const [orderNumber, setOrderNumber] = useState("");

  /** ---------- FAQs ---------- */
  const faqList = useMemo(
    () => [
      {
        question: "What are your store hours?",
        answer:
          "We operate Monday–Friday, 10:00am–6:00pm (MYT). Saturday & Sunday are holidays. Our office is at Tower 3, Kuala Lumpur.",
      },
      {
        question: "Do you have a price list?",
        answer:
          "Yes! Zuliäm Sign starts at RM699, and Zuliäm Mature at RM739. Prices may vary with size availability.",
      },
      {
        question: "How do returns work?",
        answer:
          "Returns are accepted within 30 days in unworn condition with the original receipt. Refunds are processed back to the original payment method in about 3–5 business days.",
      },
      {
        question: "What are the shipping fees?",
        answer:
          "Standard shipping is RM9.50, express is RM24.00. Orders over RM200 ship free within Peninsular Malaysia. Our official courier is J&T Express Malaysia.",
      },
      {
        question: "Where is your office?",
        answer: "We’re based at Tower 3, Kuala Lumpur, Malaysia.",
      },
    ],
    []
  );

  /** ---------- Guided catalog ---------- */
  const guidedCatalog: GuidedCatalog = useMemo(
    () => ({
      Zuliäm: {
        Signature: {
          Sign: {
            sizes: {
              "Size 7": { price: 699.0, stock: "In stock (14 available)" },
              "Size 8": { price: 699.0, stock: "Moderate (9 available)" },
              "Size 9": { price: 699.0, stock: "Low (4 available)" },
            },
          },
          Mature: {
            sizes: {
              "Size 8": { price: 739.0, stock: "In stock (12 available)" },
              "Size 9": { price: 739.0, stock: "Moderate (7 available)" },
              "Size 10": { price: 739.0, stock: "Low (3 available)" },
            },
          },
        },
        Peak: {
          "Coming Soon": {
            sizes: {}, // No sizes yet
          },
        },
      },
    }),
    []
  );

  /** ---------- Orders ---------- */
  const orderMockData: Record<string, OrderSnapshot> = useMemo(
    () => ({
      "ZA-100245": {
        customer: "Leah Summers",
        status:
          "Packed and ready for courier pickup by J&T Express Malaysia. Tracking link will be active within ~2 hours.",
        items: ["Zuliäm Sign - Size 9", "Grip socks - Size M"],
        eta: "18 June 2025",
        trackingNumber: "880123456789",
      },
      "ZA-458210": {
        customer: "Mikael Rowan",
        status:
          "In quality check. Warehouse team is verifying packaging before dispatch via J&T Express Malaysia.",
        items: ["Zuliäm Mature - Size 8"],
        eta: "21 June 2025",
        trackingNumber: "880987654321",
      },
      "ZA-778540": {
        customer: "Analise Turner",
        status: "Delivered and signed for. Courier: J&T Express Malaysia.",
        items: ["Zuliäm Sign - Size 7"],
        eta: "Delivered",
        trackingNumber: "880112233445",
      },
    }),
    []
  );

  /** ---------- Helpers ---------- */
  const resetConversation = () => {
    setMessages([
      {
        id: "intro",
        from: "bot",
        text: "Hi! I'm Zuli, your sneaker concierge. I can answer FAQs, guide you to the perfect pair (Sign, Mature, or Peak), or trace your order snapshot. What would you like today?",
      },
    ]);
    setMode("menu");
    setGuidedSelection({});
    setOrderNumber("");
  };

  const handleToggleChat = () => {
    const nextState = !isChatOpen;
    setIsChatOpen(nextState);
    if (nextState) resetConversation();
  };

  const appendMessage = (message: Message) =>
    setMessages((prev) => [...prev, message]);

  const handleFaqClick = (question: string, answer: string) => {
    appendMessage({ id: `faq-user-${question}`, from: "user", text: question });
    appendMessage({ id: `faq-bot-${question}`, from: "bot", text: answer });
  };

  const handleGuidedSelect = (
    level: keyof GuidedSelection,
    value: string,
    back?: boolean
  ) => {
    setGuidedSelection((prev) => {
      if (back) {
        if (level === "category") return { brand: prev.brand };
        if (level === "product")
          return { brand: prev.brand, category: prev.category };
        if (level === "size")
          return {
            brand: prev.brand,
            category: prev.category,
            product: prev.product,
          };
        return {};
      }

      if (level === "brand") {
        appendMessage({ id: `brand-${value}`, from: "user", text: value });
        appendMessage({
          id: `brand-confirm-${value}`,
          from: "bot",
          text: `Exploring ${value}. Choose a product line.`,
        });
        return { brand: value };
      }

      if (level === "category") {
        appendMessage({ id: `category-${value}`, from: "user", text: value });
        appendMessage({
          id: `category-confirm-${value}`,
          from: "bot",
          text: "Got it. Pick a product.",
        });
        return { brand: prev.brand, category: value };
      }

      if (level === "product") {
        appendMessage({ id: `product-${value}`, from: "user", text: value });

        if (value === "Coming Soon") {
          appendMessage({
            id: `product-comingsoon-${value}`,
            from: "bot",
            text: "The Peak line is coming soon. Stay tuned for updates!",
          });
          return { brand: prev.brand, category: prev.category, product: value };
        }

        appendMessage({
          id: `product-confirm-${value}`,
          from: "bot",
          text: "Nice pick. Choose your size.",
        });
        return { brand: prev.brand, category: prev.category, product: value };
      }

      if (level === "size") {
        appendMessage({ id: `size-${value}`, from: "user", text: value });

        const { brand, category, product } = prev;
        if (brand && category && product) {
          const details =
            guidedCatalog[brand]?.[category]?.[product]?.sizes?.[value];
          if (details) {
            appendMessage({
              id: `size-response-${value}`,
              from: "bot",
              text: `Price: MYR ${details.price.toFixed(2)}, Stock: ${
                details.stock
              }`,
            });
          } else {
            appendMessage({
              id: `size-response-missing-${value}`,
              from: "bot",
              text: "That size is inbound. Want me to set a stock alert?",
            });
          }
        }
        return { ...prev, size: value };
      }

      return prev;
    });
  };

  const handleOrderLookup = () => {
    appendMessage({
      id: `order-query-${orderNumber || "blank"}`,
      from: "user",
      text: orderNumber
        ? `Checking order ${orderNumber}`
        : "I do not have an order number",
    });

    if (!orderNumber) {
      appendMessage({
        id: "order-missing",
        from: "bot",
        text: "No worries! You can reply here any time with your Zuliäm order number (format: ZA-123456). All parcels are shipped with J&T Express Malaysia and come with a 12-digit tracking number.",
      });
      return;
    }

    const key = orderNumber.trim().toUpperCase();
    const match = orderMockData[key];

    if (match) {
      appendMessage({
        id: `order-found-${orderNumber}`,
        from: "bot",
        text: `Order for ${match.customer}: ${
          match.status
        } Items: ${match.items.join(", ")}. Estimated delivery: ${match.eta}. 
Tracking Number: ${match.trackingNumber} 
[Track on J&T Express Malaysia](https://www.jtexpress.my/track?trackingNo=${
          match.trackingNumber
        })`,
      });
    } else {
      appendMessage({
        id: `order-not-found-${orderNumber}`,
        from: "bot",
        text: "I couldn’t find that order in today’s J&T Express Malaysia manifest. Please make sure your Zuliäm order number (ZA-xxxxxx) is correct, and that you also have the 12-digit J&T tracking number once dispatched.",
      });
    }
  };

  /** ---------- Theming helpers ---------- */
  const popupBase =
    "fixed z-50 w-80 max-w-full rounded-2xl border p-4 shadow-2xl isolate";
  const popupTheme =
    theme === "dark"
      ? "bg-gray-900 border-gray-700 text-white"
      : "bg-white border-gray-200 text-gray-800";

  const headingTheme = theme === "dark" ? "text-white" : "text-gray-800";
  const subheadingTheme = theme === "dark" ? "text-gray-400" : "text-gray-500";

  const listButtonTheme =
    theme === "dark"
      ? "border-gray-600 bg-gray-800 text-gray-100 hover:bg-gray-700"
      : "border-gray-200 bg-white text-gray-700 hover:bg-gray-100";

  const botBubbleTheme =
    theme === "dark"
      ? "bg-gray-800 text-gray-100"
      : "bg-white text-gray-700 shadow";

  const userBubbleTheme =
    theme === "dark" ? "bg-indigo-500 text-white" : "bg-indigo-600 text-white";

  const inputTheme =
    theme === "dark"
      ? "border-gray-600 bg-gray-800 text-gray-100 placeholder-gray-400 focus:border-indigo-500"
      : "border-gray-200 bg-white text-gray-800 placeholder-gray-400 focus:border-indigo-500";

  const footerLinkTheme =
    theme === "dark"
      ? "text-indigo-300 hover:text-indigo-200"
      : "text-indigo-600 hover:text-indigo-500";

  /** ---------- UI renderers ---------- */
  const renderGuidedStep = () => {
    const { brand, category, product } = guidedSelection;

    if (!brand) {
      return (
        <div className="space-y-2">
          {Object.keys(guidedCatalog).map((brandName) => (
            <button
              key={brandName}
              className={`w-full rounded-md border px-3 py-2 text-left ${listButtonTheme}`}
              onClick={() => handleGuidedSelect("brand", brandName)}
            >
              {brandName}
            </button>
          ))}
        </div>
      );
    }

    if (!category) {
      return (
        <div className="space-y-2">
          {Object.keys(guidedCatalog[brand] || {}).map((categoryName) => (
            <button
              key={categoryName}
              className={`w-full rounded-md border px-3 py-2 text-left ${listButtonTheme}`}
              onClick={() => handleGuidedSelect("category", categoryName)}
            >
              {categoryName}
            </button>
          ))}
          <button
            className="mt-2 text-xs text-indigo-500"
            onClick={() => handleGuidedSelect("brand", "", true)}
          >
            ← Back
          </button>
        </div>
      );
    }

    if (!product) {
      return (
        <div className="space-y-2">
          {Object.keys(guidedCatalog[brand]?.[category] || {}).map(
            (productName) => (
              <button
                key={productName}
                className={`w-full rounded-md border px-3 py-2 text-left ${listButtonTheme}`}
                onClick={() => handleGuidedSelect("product", productName)}
              >
                {productName}
              </button>
            )
          )}
          <button
            className="mt-2 text-xs text-indigo-500"
            onClick={() => handleGuidedSelect("category", "", true)}
          >
            ← Back
          </button>
        </div>
      );
    }

    // hide size step for Coming Soon
    if (product === "Coming Soon") {
      return (
        <p className="text-sm text-gray-500">
          The Peak line is coming soon. Stay tuned!
        </p>
      );
    }

    const sizeOptions =
      guidedCatalog[brand]?.[category]?.[product]?.sizes || {};
    return (
      <div className="space-y-2">
        {Object.keys(sizeOptions).map((sizeOption) => (
          <button
            key={sizeOption}
            className={`w-full rounded-md border px-3 py-2 text-left ${listButtonTheme}`}
            onClick={() => handleGuidedSelect("size", sizeOption)}
          >
            {sizeOption}
          </button>
        ))}
        <button
          className="mt-2 text-xs text-indigo-500"
          onClick={() => handleGuidedSelect("product", "", true)}
        >
          ← Back
        </button>
      </div>
    );
  };

  const renderChatBody = () => {
    if (mode === "faq") {
      return (
        <div className="space-y-3">
          <h3 className={`text-sm font-semibold ${headingTheme}`}>
            Quick answers
          </h3>
          {faqList.map(({ question, answer }) => (
            <button
              key={question}
              className={`w-full rounded-md border px-3 py-2 text-left text-sm ${listButtonTheme}`}
              onClick={() => handleFaqClick(question, answer)}
            >
              {question}
            </button>
          ))}
          <button
            className="mt-2 text-xs text-indigo-500"
            onClick={() => setMode("menu")}
          >
            ← Back
          </button>
        </div>
      );
    }

    if (mode === "guided") {
      return (
        <div className="space-y-3">
          <h3 className={`text-sm font-semibold ${headingTheme}`}>
            Choose brand {">"} product {">"} size
          </h3>
          {renderGuidedStep()}
          <button
            className="mt-2 text-xs text-indigo-500"
            onClick={() => setMode("menu")}
          >
            ← Back to menu
          </button>
        </div>
      );
    }

    if (mode === "orders") {
      return (
        <div className="space-y-4">
          <h3 className={`text-sm font-semibold ${headingTheme}`}>
            Trace an order
          </h3>
          <input
            className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none ${inputTheme}`}
            placeholder="Enter order number (e.g. ZA-458210)"
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
          />
          <button
            className="w-full rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
            onClick={handleOrderLookup}
          >
            Check order
          </button>
          <p className={`text-xs ${subheadingTheme}`}>
            Orders are shipped with J&T Express Malaysia and include a 12-digit
            tracking number.
          </p>
          <button
            className="mt-2 text-xs text-indigo-500"
            onClick={() => setMode("menu")}
          >
            ← Back
          </button>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        <h3 className={`text-sm font-semibold ${headingTheme}`}>
          What can I help you with?
        </h3>
        <button
          className={`w-full rounded-md border px-3 py-2 text-left text-sm ${listButtonTheme}`}
          onClick={() => {
            appendMessage({ id: "menu-faq", from: "user", text: "FAQs" });
            appendMessage({
              id: "menu-faq-bot",
              from: "bot",
              text: "Here are the most requested questions:",
            });
            setMode("faq");
          }}
        >
          FAQs: store hours, price list, return policy, shipping
        </button>
        <button
          className={`w-full rounded-md border px-3 py-2 text-left text-sm ${listButtonTheme}`}
          onClick={() => {
            appendMessage({
              id: "menu-guided",
              from: "user",
              text: "Guided product flow",
            });
            appendMessage({
              id: "menu-guided-bot",
              from: "bot",
              text: "Let's find the perfect pair. Start with brand.",
            });
            setGuidedSelection({});
            setMode("guided");
          }}
        >
          Guided flow: choose Sign, Mature or Peak
        </button>
        <button
          className={`w-full rounded-md border px-3 py-2 text-left text-sm ${listButtonTheme}`}
          onClick={() => {
            appendMessage({
              id: "menu-orders",
              from: "user",
              text: "Order lookup",
            });
            appendMessage({
              id: "menu-orders-bot",
              from: "bot",
              text: "Enter your order number. I’ll surface the latest milestone from our warehouse.",
            });
            setOrderNumber("");
            setMode("orders");
          }}
        >
          Trace an order number
        </button>
      </div>
    );
  };

  return (
    <>
      {/* Launcher */}
      <button
        className="fixed z-50 flex items-center rounded-full bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-indigo-500"
        style={{
          bottom: offset?.bottom ?? 24,
          right: placement === "bottom-right" ? offset?.right ?? 24 : undefined,
          left: placement === "bottom-left" ? offset?.left ?? 24 : undefined,
        }}
        onClick={handleToggleChat}
      >
        <IoChatbubblesOutline className="mr-2 text-lg" />
        {triggerText}
      </button>

      {/* Popup */}
      {isChatOpen && (
        <div
          className={`${popupBase} ${popupTheme}`}
          style={{
            bottom: (offset?.bottom ?? 24) + 72,
            right:
              placement === "bottom-right" ? offset?.right ?? 24 : undefined,
            left: placement === "bottom-left" ? offset?.left ?? 24 : undefined,
          }}
        >
          <div className="mb-3 flex items-center justify-between">
            <div>
              <p className={`text-sm font-semibold ${headingTheme}`}>{title}</p>
              <p className={`text-xs ${subheadingTheme}`}>{subtitle}</p>
            </div>
            <button
              onClick={() => setIsChatOpen(false)}
              className={`rounded-full p-1 transition ${
                theme === "dark"
                  ? "text-gray-300 hover:bg-white/10"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              <IoClose className="text-lg" />
            </button>
          </div>

          <div
            className={`mb-4 max-h-48 space-y-2 overflow-y-auto rounded-md p-3 text-sm ${
              theme === "dark" ? "bg-gray-800" : "bg-gray-50"
            }`}
          >
            {messages.map((message) => (
              <div
                key={message.id}
                className={`rounded-md px-3 py-2 ${
                  message.from === "bot" ? botBubbleTheme : userBubbleTheme
                }`}
              >
                {message.text}
              </div>
            ))}
          </div>

          {renderChatBody()}

          <div className="mt-4 text-right">
            <button
              className={`text-xs font-semibold ${footerLinkTheme}`}
              onClick={resetConversation}
            >
              Restart conversation
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ZuliChat;
