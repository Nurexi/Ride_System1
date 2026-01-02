// ============================================
// RideFair Website - JavaScript Functionality
// ============================================

document.addEventListener("DOMContentLoaded", () => {
  // ============================================
  // LANGUAGE SWITCHER FUNCTIONALITY
  // ============================================
  class LanguageManager {
    constructor() {
      this.currentLang = "en";
      this.translations = {
        en: {
          // Navigation
          site_name: "RideFair",
          site_title: "RideFair - Premium Mobility Platform",
          nav_home: "Home",
          nav_about: "About",
          nav_book: "Book",
          nav_pricing: "Pricing",
          nav_services: "Services",
          nav_safety: "Safety",
          nav_contact: "Contact",
          nav_become_driver: "Become a Driver",
          nav_sign_up: "Sign Up",

          // Hero Section
          hero_title_1: "Fair Rides.",
          hero_title_2: "Fair Prices.",
          hero_subtitle:
            "A global mobility platform where riders set their price and choose their driver. Premium mobility that empowers everyone.",
          app_store_label_1: "Download on the",
          app_store_label_2: "App Store",
          play_store_label_1: "Get it on",
          play_store_label_2: "Google Play",
          stat_cities: "Cities",
          stat_downloads: "Million Downloads",
          stat_countries: "Countries",
          phone_tagline: "Your ride, your price",
          phone_location_label: "Current Location",
          phone_fare_label: "Estimated Fare",
          phone_drivers_label: "Available Drivers",
          phone_select_button: "Select",

          // Categories Section
          categories_title_1: "Top",
          categories_title_2: "Categories",
          categories_subtitle:
            "Choose from our premium ride categories designed for every need and occasion",
          category_economy: "Economy",
          category_economy_desc:
            "Affordable rides without compromising on safety and comfort.",
          category_comfort: "Comfort",
          category_comfort_desc:
            "Spacious vehicles with extra legroom and premium amenities.",
          category_business: "Business",
          category_business_desc:
            "Professional rides for business meetings and corporate travel.",
          category_intercity: "Intercity",
          category_intercity_desc:
            "Comfortable long-distance travel between cities with fixed pricing.",
          learn_more: "Learn More",

          // Services Section
          services_title_1: "Our",
          services_title_2: "Services",
          services_subtitle:
            "Comprehensive mobility solutions for every journey, anytime, anywhere",
          service_ride_hailing: "Ride Hailing",
          service_ride_hailing_desc:
            "Book a ride in seconds with our advanced matching algorithm and transparent pricing.",
          service_scheduled_rides: "Scheduled Rides",
          service_scheduled_rides_desc:
            "Plan your trips in advance with guaranteed availability and fixed pricing.",
          service_ride_sharing: "Ride Sharing",
          service_ride_sharing_desc:
            "Share your ride with others heading in the same direction and split the cost.",
          service_corporate_travel: "Corporate Travel",
          service_corporate_travel_desc:
            "Professional transportation solutions for business meetings and corporate events.",
          service_airport_transfers: "Airport Transfers",
          service_airport_transfers_desc:
            "Reliable airport pickup and drop-off services with real-time flight tracking.",
          service_intercity_travel: "Intercity Travel",
          service_intercity_travel_desc:
            "Comfortable long-distance rides between cities with fixed pricing and amenities.",

          // How It Works
          how_it_works_title_1: "How It",
          how_it_works_title_2: "Works",
          how_it_works_subtitle:
            "A simple, transparent process for both riders and drivers",
          step_1_title: "Set Your Route",
          step_1_desc:
            "Enter your pickup and destination locations in the app.",
          step_2_title: "Set Your Price",
          step_2_desc:
            "Suggest a fare that works for you, not what the app tells you.",
          step_3_title: "Choose a Driver",
          step_3_desc:
            "See driver profiles, ratings, and counteroffers, then choose who to ride with.",
          step_4_title: "Ride Safely",
          step_4_desc:
            "Track your trip in real-time with safety features and support.",

          // Safety Section
          safety_title_1: "Your Safety",
          safety_title_2: "is Our Priority",
          safety_subtitle:
            "Multiple layers of protection in every ride, 24/7 support, and emergency features",
          safety_feature_1_title: "Driver Verification",
          safety_feature_1_desc:
            "All drivers undergo rigorous background checks and screening before approval.",
          safety_feature_2_title: "Real-time Tracking",
          safety_feature_2_desc:
            "Share your trip details with friends or family for added security and peace of mind.",
          safety_feature_3_title: "24/7 Support",
          safety_feature_3_desc:
            "Our support team is available around the clock to assist you with any concerns.",
          safety_feature_4_title: "Emergency Button",
          safety_feature_4_desc:
            "One-tap access to emergency services and RideFair safety team during your ride.",
          safety_center: "Safety Center",
          safety_share_trip: "Share Trip",
          safety_emergency: "Emergency",
          safety_support: "Support",
          safety_trip_details: "Trip Details",
          safety_mode_active: "Safety Mode Active",
          safety_gps_tracking: "GPS Tracking",
          safety_emergency_contact: "Emergency Contact",
          safety_driver_verification: "Driver Verification",
          safety_support_24_7: "24/7 Support",

          // Driver CTA
          drive_title_1: "Drive",
          drive_title_2: "With Us",
          drive_subtitle:
            "Earn money on your schedule with fair commissions and flexible hours",
          benefit_1_title: "Higher Earnings",
          benefit_1_desc:
            "Keep more of what you earn with our industry-low commission rates and surge pricing.",
          benefit_2_title: "Flexible Schedule",
          benefit_2_desc:
            "Drive whenever you want - no shifts or minimum hours required. Be your own boss.",
          benefit_3_title: "Fair Negotiation",
          benefit_3_desc:
            "Negotiate fares directly with passengers for a fair deal that works for both parties.",

          // Cities Section
          cities_title_1: "Available",
          cities_title_2: "Worldwide",
          cities_subtitle:
            "Serving millions of users across the globe in 700+ cities",
          top_cities: "Top Cities",
          view_all_cities: "View all 700+ cities",

          // Business Section
          business_title_1: "Solutions for",
          business_title_2: "Business",
          business_subtitle:
            "Reliable transportation solutions for companies of all sizes",
          business_simplified_billing: "Simplified Billing",
          business_simplified_billing_desc:
            "Single monthly invoice with detailed usage reports and expense tracking.",
          business_custom_policies: "Custom Policies",
          business_custom_policies_desc:
            "Set ride policies, spending limits, and approved services for your team.",
          business_usage_analytics: "Usage Analytics",
          business_usage_analytics_desc:
            "Track transportation spending and optimize your company's mobility budget.",

          // Footer
          footer_tagline: "Fair rides. Fair prices. Worldwide.",
          footer_riders: "Riders",
          footer_drivers: "Drivers",
          footer_company: "Company",
          footer_legal: "Legal",
          footer_how_it_works: "How it works",
          footer_fare_estimate: "Fare estimate",
          footer_cities: "Cities",
          footer_safety: "Safety",
          footer_help_center: "Help Center",
          footer_become_driver: "Become a driver",
          footer_driver_requirements: "Driver requirements",
          footer_driver_portal: "Driver portal",
          footer_driver_support: "Driver support",
          footer_earnings: "Earnings",
          footer_about_us: "About us",
          footer_careers: "Careers",
          footer_press: "Press",
          footer_blog: "Blog",
          footer_brand_guidelines: "Brand guidelines",
          footer_privacy_policy: "Privacy Policy",
          footer_terms_of_service: "Terms of Service",
          footer_cookie_policy: "Cookie Policy",
          footer_accessibility: "Accessibility",
          footer_licenses: "Licenses",
          footer_all_rights_reserved: "All rights reserved.",

          // Modal
          modal_become_driver_title: "Become a RideFair Driver",
          modal_full_name: "Full Name",
          modal_full_name_placeholder: "Enter your full name",
          modal_email: "Email Address",
          modal_email_placeholder: "Enter your email",
          modal_phone: "Phone Number",
          modal_phone_placeholder: "Enter your phone number",
          modal_city: "City",
          modal_city_placeholder: "Enter your city",
          modal_vehicle_type: "Vehicle Type",
          modal_select_vehicle: "Select vehicle type",
          modal_vehicle_car: "Car",
          modal_vehicle_suv: "SUV",
          modal_vehicle_van: "Van",
          modal_vehicle_motorcycle: "Motorcycle",
          modal_submit_application: "Submit Application",

          // Booking Page
          nav_book: "Book",
          booking_page_title: "Book Now - RideFair",
          booking_title_1: "Book",
          booking_title_2: "Your Ride",
          booking_subtitle: "Simple, transparent, and fair pricing for every journey",
          step_trip_details: "Trip Details",
          step_vehicle: "Vehicle",
          step_price: "Price",
          step_payment: "Payment",
          step_confirm: "Confirm",
          
          // Trip Details Section
          trip_details_title: "Trip Details",
          trip_details_subtitle: "Enter your pickup and destination locations",
          pickup_location: "Pickup Location",
          pickup_placeholder: "Enter pickup address",
          destination: "Destination",
          destination_placeholder: "Where are you going?",
          additional_notes: "Additional Notes (Optional)",
          notes_placeholder: "Special instructions, luggage details, etc.",
          continue_to_vehicle: "Continue to Vehicle Selection",
          
          // Vehicle Selection
          choose_vehicle_title: "Choose Your Vehicle",
          choose_vehicle_subtitle: "Select the perfect ride for your journey",
          vehicle_economy: "Economy",
          vehicle_economy_desc: "Affordable and efficient",
          vehicle_comfort: "Comfort",
          vehicle_comfort_desc: "Extra space and comfort",
          vehicle_business: "Business",
          vehicle_business_desc: "Professional and premium",
          vehicle_motorcycle: "Motorcycle",
          vehicle_motorcycle_desc: "Fast and economical",
          vehicle_electric: "Electric",
          vehicle_electric_desc: "Eco-friendly ride",
          vehicle_van: "Van / Cargo",
          vehicle_van_desc: "Space for luggage/groups",
          estimated_price_range: "Estimated Price Range",
          price_negotiable_note: "Prices are negotiable based on driver availability and traffic conditions",
          your_selected_range: "Your selected vehicle range",
          continue_to_price: "Continue to Price",
          
          // Price Negotiation
          negotiate_price_title: "Negotiate Your Price",
          negotiate_price_subtitle: "Propose a fair price and negotiate with drivers",
          your_offer: "Your Offer",
          price_hint: "Enter your proposed fare (ETB 50 - 1000)",
          send_offer: "Send Offer to Drivers",
          driver_response: "Driver Response",
          send_offer_message: "Send your offer to see driver responses",
          driver_counter_offer: "Driver Counter Offer:",
          reject_offer: "Reject",
          accept_offer: "Accept ETB",
          price_agreed: "Price Agreed!",
          driver_arrive_note: "Driver will arrive shortly",
          
          // Safety Features
          safety_support_title: "Safety & Support",
          verified_driver: "Verified Driver",
          verified_driver_desc: "All drivers are verified and screened",
          emergency_sos: "Emergency SOS",
          emergency_sos_desc: "24/7 emergency support",
          share_trip: "Share Trip",
          share_trip_desc: "Share your trip with loved ones",
          support_24_7: "24/7 Support",
          support_24_7_desc: "Always here to help",
          continue_to_payment: "Continue to Payment",
          
          // Payment Method
          payment_method_title: "Payment Method",
          payment_method_subtitle: "Choose how you'd like to pay",
          payment_cash: "Cash",
          payment_cash_desc: "Pay directly to the driver",
          payment_cbe: "Commercial Bank of Ethiopia",
          payment_cbe_desc: "Secure bank transfer",
          payment_awash: "Awash Bank",
          payment_awash_desc: "Instant payment processing",
          payment_abyssinia: "Abyssinia Bank",
          payment_abyssinia_desc: "Quick and secure",
          payment_dashen: "Dashen Bank",
          payment_dashen_desc: "Reliable banking partner",
          
          // Wallet
          ridefair_wallet: "RideFair Wallet",
          pay_from_wallet: "Pay from wallet",
          current_balance: "Current Balance",
          payment_amount: "Payment Amount",
          balance_after_payment: "Balance After Payment",
          confirm_wallet_payment: "Confirm Wallet Payment",
          wallet_secure_note: "Your payment is secure and encrypted",
          insufficient_balance: "Insufficient Balance",
          payment_confirmed: "Payment Confirmed",
          review_booking: "Review Booking",
          
          // Booking Summary
          booking_summary_title: "Booking Summary",
          booking_summary_subtitle: "Review your trip details before confirming",
          trip_details: "Trip Details",
          pickup: "Pickup:",
          destination_label: "Destination:",
          notes: "Notes:",
          none: "None",
          vehicle_details: "Vehicle Details",
          vehicle_type: "Vehicle Type:",
          price_range: "Price Range:",
          payment_details: "Payment Details",
          agreed_price: "Agreed Price:",
          payment_method: "Payment Method:",
          wallet_payment: "Wallet Payment:",
          yes: "Yes",
          no: "No",
          total_fare: "Total Fare",
          terms_agreement: "I agree to the Terms of Service and understand that prices are negotiable and may vary based on traffic conditions.",
          terms_of_service: "Terms of Service",
          back: "Back",
          confirm_booking: "Confirm Booking",
          
          // Confirmation Modal
          ride_booked_success: "Ride Booked Successfully!",
          booking_confirmed_message: "Your ride has been confirmed! A driver will arrive shortly.",
          safety_priority_message: "Your safety is our priority. Share your trip details with friends or family for added security.",
          estimated_arrival: "Estimated arrival:",
          minutes: "minutes",
          back_to_home: "Back to Home",
          view_trip_details: "View Trip Details",
          
          // Mobile Footer
          continue_to_vehicle_mobile: "Continue to Vehicle",
          continue_to_price_mobile: "Continue to Price",
          continue_to_payment_mobile: "Continue to Payment",
          review_booking_mobile: "Review Booking",
          confirm_booking_mobile: "Confirm Booking",

          // About Page
          about_page_title: "About Us - RideFair",
          about_page_subtitle: "Reinventing mobility through fairness, transparency, and choice.",
          mission_title_1: "Our",
          mission_title_2: "Mission",
          mission_desc_1: "Our mission is to create a mobility platform where riders and drivers can interact fairly, transparently, and independently — without algorithmic price manipulation.",
          mission_desc_2: "We believe that transportation should empower both passengers and drivers. That's why we've built a system where riders set their own price, drivers choose the rides they want, and both parties have complete transparency into every transaction.",
          mission_highlight_1: "Fair pricing with no hidden surges",
          mission_highlight_2: "Driver autonomy and choice",
          mission_highlight_3: "Transparent trip data",
          mission_card_title: "Fairness First",
          mission_card_desc: "We put fairness at the heart of everything we do.",
          values_title_1: "Why We",
          values_title_2: "Exist",
          values_subtitle: "The core values that drive every decision we make",
          value_1_title: "Fair Pricing",
          value_1_desc: "Riders and drivers both deserve fair prices, not inflated surge rates or hidden fees.",
          value_2_title: "Empowering Drivers",
          value_2_desc: "Drivers have full autonomy to choose which rides they accept and set their terms.",
          value_3_title: "Safer Mobility",
          value_3_desc: "Advanced safety features, verification checks, and 24/7 support for all users.",
          value_4_title: "Customer First",
          value_4_desc: "Every decision is driven by what's best for our riders and drivers.",
          presence_title_1: "Global",
          presence_title_2: "Presence",
          presence_subtitle: "Trusted by millions across the world",
          stat_million_users: "Million Users",
          stat_million_rides: "Million Rides Daily",
          difference_title_1: "What Makes",
          difference_title_2: "Us Different",
          difference_1: "Riders set their own price",
          difference_2: "Drivers choose the rides they want",
          difference_3: "Safety first approach",
          difference_4: "No surge pricing manipulation",
          difference_5: "Transparent ride data",
          difference_6: "Fair driver commissions",
          team_title_1: "Meet Our",
          team_title_2: "Teams",
          team_subtitle: "Visionary leaders building the future of fair mobility",
          testimonials_title_1: "What Users",
          testimonials_title_2: "Say",
          testimonials_subtitle: "Real stories from riders and drivers worldwide",
          cta_title: "Join the Future of Fair Mobility",
          cta_subtitle: "Experience a ride-sharing platform built on fairness, transparency, and choice.",
          cta_download_app: "Download App",
          footer_support: "Support",
          footer_insurance: "Insurance",

          // Contact Page
          contact_page_title: "Contact & Support - RideFair",
          contact_title_1: "Contact",
          contact_title_2: "& Support",
          contact_subtitle: "24/7 professional assistance for riders, drivers, and business partners",
          contact_stat_1: "24/7 Support",
          contact_stat_2: "Average Response: < 5 min",
          contact_stat_3: "Global Assistance",
          contact_method_title: "Choose Your Preferred Contact Method",
          contact_method_subtitle: "Select the most convenient way to reach our dedicated support teams",
          contact_live_title: "Live Support",
          contact_live_desc: "Instant assistance via chat or phone",
          contact_email_title: "Email Support",
          contact_email_desc: "Detailed inquiries with expert response",
          contact_driver_title: "Driver Support",
          contact_driver_desc: "Dedicated assistance for drivers",
          contact_info_title: "Direct Contact Information",
          contact_info_subtitle: "Reach out to specific departments for targeted assistance",
          contact_customer_support: "Customer Support",
          contact_business_enterprise: "Business & Enterprise",
          contact_safety_emergency: "Safety & Emergency",
          contact_support_categories_title: "Quick Support Categories",
          contact_support_categories_subtitle: "Find instant solutions for common issues",
          contact_faq_title: "Frequently Asked Questions",
          contact_faq_subtitle: "Quick answers to common inquiries",
          footer_tagline_contact: "Professional transportation solutions worldwide.",
          footer_support_title: "Support",

          // Safety Page
          safety_page_title: "Safety First | RideFair - Premium Mobility Platform",

          // Drivers Page
          drivers_page_title: "Drive With Us - RideFair",

          // Auth Page
          auth_page_title: "Login & Signup - RideFair",
          auth_hero_title_1: "Join the Future",
          auth_hero_title_2: "of Fair Mobility",
          auth_hero_subtitle: "Experience premium rides, transparent pricing, and complete control. Where riders and drivers connect fairly.",
          auth_feature_1: "Bank-level Security",
          auth_feature_2: "Instant Access",
          auth_feature_3: "Global Network",
        },
        am: {
          // Navigation
          site_name: "ራይድፌር",
          site_title: "ራይድፌር - ፕሪሚየም ሞቢሊቲ መድረክ",
          nav_home: "መግቢያ",
          nav_about: "ስለ እኛ",
          nav_pricing: "ዋጋ",
          nav_services: "አገልግሎቶች",
          nav_safety: "ደህንነት",
          nav_contact: "አግኙን",
          nav_become_driver: "አሽከርካሪ ይሁኑ",
          nav_sign_up: "ተመዝገቡ",

          // Hero Section
          hero_title_1: "ፍትሃዊ መንቀሳቀስ.",
          hero_title_2: "ፍትሃዊ ዋጋ.",
          hero_subtitle:
            "ዓለም አቀፍ ሞቢሊቲ መድረክ ተጓዦች ዋጋቸውን የሚያስቀምጡበት እና አሽከርካሪያቸውን የሚመርጡበት። ሁሉንም የሚያስተዳድር ፕሪሚየም ሞቢሊቲ።",
          app_store_label_1: "ከ App Store ያውርዱ",
          app_store_label_2: "ኤፕል ስቶር",
          play_store_label_1: "ከ Google Play ያግኙት",
          play_store_label_2: "ጉግል ፕሌይ",
          stat_cities: "ከተሞች",
          stat_downloads: "ሚሊዮን የወረዱ",
          stat_countries: "አገራት",
          phone_tagline: "ጉዞዎ፣ ዋጋዎ",
          phone_location_label: "የአሁኑ አድራሻ",
          phone_fare_label: "የተገመተ ዋጋ",
          phone_drivers_label: "የሚገኙ አሽከርካሪዎች",
          phone_select_button: "ምረጥ",

          // Categories Section
          categories_title_1: "የቀን",
          categories_title_2: "ምድቦች",
          categories_subtitle:
            "ለእያንዳንዱ ፍላጎት እና አጋጣሚ ለተዘጋጁ የፕሪሚየም የጉዞ ምድቦቻችንን ይምረጡ",
          category_economy: "ኢኮኖሚ",
          category_economy_desc: "ደህንነት እና አለባበስን ሳይቀር ርካሽ መንቀሳቀስ።",
          category_comfort: "ኮምፎርት",
          category_comfort_desc:
            "ተጨማሪ የእግር ቦታ እና የፕሪሚየም አቀማመጦች ያሉት ሰፊ ተሽከርካሪዎች።",
          category_business: "ንግድ",
          category_business_desc: "ለንግድ ስብሰባዎች እና የድርጅት ጉዞ ፕሮፌሽናል መንቀሳቀስ።",
          category_intercity: "የከተሞች መካከል",
          category_intercity_desc: "በቋሚ ዋጋ በከተሞች መካከል ሆነደና የረዥም ርቀት ጉዞ።",
          learn_more: "ተጨማሪ ያንብቡ",

          // Services Section
          services_title_1: "የእኛ",
          services_title_2: "አገልግሎቶች",
          services_subtitle:
            "ለእያንዳንዱ ጉዞ፣ በማንኛውም ጊዜ፣ በማንኛውም ቦታ የሚደርሱ የሙሉ ሞቢሊቲ መፍትሄዎች",
          service_ride_hailing: "መንቀሳቀስ ማሰስ",
          service_ride_hailing_desc:
            "በሰከንድ ውስጥ ጉዞ ይቅዱ በእኛ የላቁ የማዛመድ አልጎሪዝም እና ግልጽ ዋጋ መስጠት።",
          service_scheduled_rides: "በቀጠሮ የሚደረጉ ጉዞዎች",
          service_scheduled_rides_desc:
            "ጉዞዎችዎን ቀደም ብለው ያቅዱ በተረጋገጠ መገኘት እና ቋሚ ዋጋ።",
          service_ride_sharing: "መንቀሳቀስ መጋራት",
          service_ride_sharing_desc:
            "ጉዞዎን ከሌሎች በተመሳሳይ አቅጣጫ በሚሄዱ ጋር ያጋሩ እና ወጪውን ይካፈሉ።",
          service_corporate_travel: "የድርጅት ጉዞ",
          service_corporate_travel_desc:
            "ለንግድ ስብሰባዎች እና የድርጅት ክስተቶች ፕሮፌሽናል የትራንስፖርቴሽን መፍትሄዎች።",
          service_airport_transfers: "የአውሮፕላን ማረፊያ ማጓጓዣ",
          service_airport_transfers_desc:
            "በእውነተኛ ጊዜ የበረራ መከታተያ ያለው አስተማማኝ የአውሮፕላን ማነሳሻ እና የማረፊያ አገልግሎቶች።",
          service_intercity_travel: "የከተሞች መካከል ጉዞ",
          service_intercity_travel_desc:
            "በቋሚ ዋጋ እና አቀማመጦች በከተሞች መካከል ሆነደና የረዥም ርቀት ጉዞ።",

          // How It Works
          how_it_works_title_1: "እንዴት",
          how_it_works_title_2: "ስራ",
          how_it_works_subtitle: "ለተጓዦች እና ለአሽከርካሪዎች ቀላል፣ ግልጽ ሂደት",
          step_1_title: "ማስጓዝ አቅጣጫዎን ያዘጋጁ",
          step_1_desc: "የማንሳት እና የመድረሻ አድራሻዎችዎን በአፕሉ ውስጥ ያስገቡ።",
          step_2_title: "ዋጋዎን ያዘጋጁ",
          step_2_desc: "ለእርስዎ ለሚሰራ ዋጋ ያቅርቡ፣ አፕሉ የሚነግርዎትን አይደለም።",
          step_3_title: "አሽከርካሪ ይምረጡ",
          step_3_desc:
            "የአሽከርካሪ መግለጫዎችን፣ ደረጃዎችን እና የተቃራኒ አቅርቦቶችን ይመልከቱ፣ ከዚያ ከማን ጋር መንቀሳቀስ እንደሚፈልጉ ይምረጡ።",
          step_4_title: "በደህንነት ይጉዙ",
          step_4_desc: "ጉዞዎን በደህንነት ባህሪያት እና ድጋፍ በእውነተኛ ጊዜ ይከታተሉ።",

          // Safety Section
          safety_title_1: "የእርስዎ ደህንነት",
          safety_title_2: "ቅድሚያችን ነው",
          safety_subtitle:
            "በእያንዳንዱ ጉዞ ውስጥ ብዙ ደረጃዎች የጥበቃ፣ 24/7 ድጋፍ እና የአደጋ ባህሪያት",
          safety_feature_1_title: "የአሽከርካሪ ማረጋገጫ",
          safety_feature_1_desc:
            "ሁሉም አሽከርካሪዎች ከመፍቀድ በፊት ጥብቅ የጀርባ ማረጋገጫ እና ማጣራት ያልፋሉ።",
          safety_feature_2_title: "በእውነተኛ ጊዜ መከታተያ",
          safety_feature_2_desc:
            "የጉዞዎን ዝርዝሮች ከጓደኞችዎ ወይም ከቤተሰብዎ ጋር ለተጨማሪ ደህንነት እና ሰላም ልብ ያጋሩ።",
          safety_feature_3_title: "24/7 ድጋፍ",
          safety_feature_3_desc:
            "የድጋፍ ቡድናችን ለማንኛውም ግዴታዎ በማንኛውም ጊዜ እርስዎን ለመርዳት ዝግጁ ነው።",
          safety_feature_4_title: "የአደጋ አዝራር",
          safety_feature_4_desc:
            "በጉዞዎ ጊዜ ወደ አደጋ አገልግሎቶች እና የራይድፌር የደህንነት ቡድን አንድ ጫት መዳረሻ።",
          safety_center: "የደህንነት ማዕከል",
          safety_share_trip: "ጉዞ አጋራ",
          safety_emergency: "አደጋ",
          safety_support: "ድጋፍ",
          safety_trip_details: "የጉዞ ዝርዝሮች",
          safety_mode_active: "የደህንነት ሁነታ ንቁ",
          safety_gps_tracking: "ጂፒኤስ መከታተያ",
          safety_emergency_contact: "የአደጋ አድራሻ",
          safety_driver_verification: "የአሽከርካሪ ማረጋገጫ",
          safety_support_24_7: "24/7 ድጋፍ",

          // Driver CTA
          drive_title_1: "ከኛ",
          drive_title_2: "ሆነድ ይጉዙ",
          drive_subtitle: "በፍትሃዊ ኮሚሽን መጠን እና ተለዋዋጭ ሰዓታት በመርሃ ግብርዎ ገንዘብ ያግኙ",
          benefit_1_title: "ከፍተኛ ገቢ",
          benefit_1_desc:
            "በኛ የኢንዱስትሪ ዝቅተኛ ኮሚሽን መጠን እና የዋጋ መጨመር የሚያገኙትን በላይ ያስቀሩ።",
          benefit_2_title: "ተለዋዋጭ መርሃ ግብር",
          benefit_2_desc:
            "የሚፈልጉትን ጊዜ ይጉዙ - ማንቀሳቀስ ወይም ዝቅተኛ ሰዓታት አያስፈልግም። የራስዎ አለቃ ይሁኑ።",
          benefit_3_title: "ፍትሃዊ ድርድር",
          benefit_3_desc: "ዋጋን በቀጥታ ከተጓዦች ጋር ለሁለቱም ወገኖች ለሚሰራ ፍትሃዊ ስምምነት ይደርድሩ።",

          // Cities Section
          cities_title_1: "የሚገኝ",
          cities_title_2: "በዓለም ዙሪያ",
          cities_subtitle: "በ700+ ከተሞች በዓለም ዙሪያ ሚሊዮኖች የሚቆጠሩ ተጠቃሚዎችን እያገለገልን ነው",
          top_cities: "የቀን ከተሞች",
          view_all_cities: "ሁሉንም 700+ ከተሞች ይመልከቱ",

          // Business Section
          business_title_1: "ለ",
          business_title_2: "ንግድ መፍትሄዎች",
          business_subtitle: "ለሁሉም መጠን ኩባንያዎች አስተማማኝ የትራንስፖርቴሽን መፍትሄዎች",
          business_simplified_billing: "ቀለል ያለ የክፍያ ማስረጃ",
          business_simplified_billing_desc:
            "ከዝርዝር የአጠቃቀም ሪፖርቶች እና የወጪ መከታተያ ጋር ነጠላ ወርሃዊ ክፍያ ማስረጃ።",
          business_custom_policies: "ብጁ ፖሊሲዎች",
          business_custom_policies_desc:
            "ለቡድንዎ የጉዞ ፖሊሲዎችን፣ የማሳለፊያ ገደቦችን እና የተፈቀዱ አገልግሎቶችን ያዘጋጁ።",
          business_usage_analytics: "የአጠቃቀም ትንተና",
          business_usage_analytics_desc:
            "የትራንስፖርቴሽን ወጪን ይከታተሉ እና የኩባንያዎን የሞቢሊቲ በጀት ያመቻቻሉ።",

          // Footer
          footer_tagline: "ፍትሃዊ ጉዞዎች። ፍትሃዊ ዋጋ። በዓለም ዙሪያ።",
          footer_riders: "ተጓዦች",
          footer_drivers: "አሽከርካሪዎች",
          footer_company: "ኩባንያ",
          footer_legal: "ሕጋዊ",
          footer_how_it_works: "እንዴት እንደሚሰራ",
          footer_fare_estimate: "የተገመተ ዋጋ",
          footer_cities: "ከተሞች",
          footer_safety: "ደህንነት",
          footer_help_center: "የእርዳታ ማዕከል",
          footer_become_driver: "አሽከርካሪ ይሁኑ",
          footer_driver_requirements: "የአሽከርካሪ መስፈርቶች",
          footer_driver_portal: "የአሽከርካሪ ፖርታል",
          footer_driver_support: "የአሽከርካሪ ድጋፍ",
          footer_earnings: "ገቢዎች",
          footer_about_us: "ስለ እኛ",
          footer_careers: "ስራዎች",
          footer_press: "ፕሬስ",
          footer_blog: "ብሎግ",
          footer_brand_guidelines: "የብራንድ መመሪያዎች",
          footer_privacy_policy: "የግላዊነት ፖሊሲ",
          footer_terms_of_service: "የአገልግሎት ውሎች",
          footer_cookie_policy: "የኩኪ ፖሊሲ",
          footer_accessibility: "ተደራሽነት",
          footer_licenses: "ፈቃዶች",
          footer_all_rights_reserved: "ሁሉም መብቶች የተጠበቁ ናቸው።",

          // Modal
          modal_become_driver_title: "የራይድፌር አሽከርካሪ ይሁኑ",
          modal_full_name: "ሙሉ ስም",
          modal_full_name_placeholder: "ሙሉ ስምዎን ያስገቡ",
          modal_email: "የኢሜል አድራሻ",
          modal_email_placeholder: "ኢሜልዎን ያስገቡ",
          modal_phone: "ስልክ ቁጥር",
          modal_phone_placeholder: "ስልክ ቁጥርዎን ያስገቡ",
          modal_city: "ከተማ",
          modal_city_placeholder: "ከተማዎን ያስገቡ",
          modal_vehicle_type: "የተሽከርካሪ አይነት",
          modal_select_vehicle: "የተሽከርካሪ አይነት ይምረጡ",
          modal_vehicle_car: "መኪና",
          modal_vehicle_suv: "ኤስዩቪ",
          modal_vehicle_van: "ቫን",
          modal_vehicle_motorcycle: "ሞተርሳይክል",
          modal_submit_application: "ያመልክቱ",

          // Booking Page
          nav_book: "ቦታ ይዘዙ",
          booking_page_title: "አሁን ቦታ ይዘዙ - ራይድፌር",
          booking_title_1: "ቦታ",
          booking_title_2: "ይዘዙ",
          booking_subtitle: "ለእያንዳንዱ ጉዞ ቀላል፣ ግልጽ እና ፍትሃዊ ዋጋ",
          step_trip_details: "የጉዞ ዝርዝሮች",
          step_vehicle: "ተሽከርካሪ",
          step_price: "ዋጋ",
          step_payment: "ክፍያ",
          step_confirm: "አረጋግጥ",
          
          // Trip Details Section
          trip_details_title: "የጉዞ ዝርዝሮች",
          trip_details_subtitle: "የማንሳት እና የመድረሻ አድራሻዎችዎን ያስገቡ",
          pickup_location: "የማንሳት አድራሻ",
          pickup_placeholder: "የማንሳት አድራሻ ያስገቡ",
          destination: "መድረሻ",
          destination_placeholder: "የት እየሄዱ ነው?",
          additional_notes: "ተጨማሪ ማስታወሻዎች (አማራጭ)",
          notes_placeholder: "ልዩ መመሪያዎች፣ የሻንጣ ዝርዝሮች፣ ወዘተ።",
          continue_to_vehicle: "ወደ ተሽከርካሪ ምርጫ ይቀጥሉ",
          
          // Vehicle Selection
          choose_vehicle_title: "ተሽከርካሪዎን ይምረጡ",
          choose_vehicle_subtitle: "ለጉዞዎ ፍጹም የሆነ መንገድ ይምረጡ",
          vehicle_economy: "ኢኮኖሚ",
          vehicle_economy_desc: "ርካሽ እና ቀልጣፋ",
          vehicle_comfort: "ኮምፎርት",
          vehicle_comfort_desc: "ተጨማሪ ቦታ እና ምቾት",
          vehicle_business: "ንግድ",
          vehicle_business_desc: "ፕሮፌሽናል እና ፕሪሚየም",
          vehicle_motorcycle: "ሞተርሳይክል",
          vehicle_motorcycle_desc: "ፈጣን እና ኢኮኖሚያዊ",
          vehicle_electric: "ኤሌክትሪክ",
          vehicle_electric_desc: "ለአካባቢ ተስማሚ መንገድ",
          vehicle_van: "ቫን / ካርጎ",
          vehicle_van_desc: "ለሻንጣ/ቡድኖች ቦታ",
          estimated_price_range: "የተገመተ የዋጋ ክልል",
          price_negotiable_note: "ዋጋዎች በአሽከርካሪ መገኘት እና የትራፊክ ሁኔታዎች ላይ በመመስረት ሊደራደሩ ይችላሉ",
          your_selected_range: "የእርስዎ የተመረጠ ተሽከርካሪ ክልል",
          continue_to_price: "ወደ ዋጋ ይቀጥሉ",
          
          // Price Negotiation
          negotiate_price_title: "ዋጋዎን ይደራደሩ",
          negotiate_price_subtitle: "ፍትሃዊ ዋጋ ያቅርቡ እና ከአሽከርካሪዎች ጋር ይደራደሩ",
          your_offer: "የእርስዎ አቅርቦት",
          price_hint: "የተሰጠ ዋጋዎን ያስገቡ (ብር 50 - 1000)",
          send_offer: "ለአሽከርካሪዎች አቅርቦት ላክ",
          driver_response: "የአሽከርካሪ ምላሽ",
          send_offer_message: "የአሽከርካሪዎች ምላሽ ለማየት አቅርቦትዎን ይላኩ",
          driver_counter_offer: "የአሽከርካሪ ተቃራኒ አቅርቦት:",
          reject_offer: "ውድቅ አድርግ",
          accept_offer: "ብር ተቀበል",
          price_agreed: "ዋጋ ተስማምቷል!",
          driver_arrive_note: "አሽከርካሪ በቅርቡ ይደርሳል",
          
          // Safety Features
          safety_support_title: "ደህንነት እና ድጋፍ",
          verified_driver: "የተረጋገጠ አሽከርካሪ",
          verified_driver_desc: "ሁሉም አሽከርካሪዎች የተረጋገጡ እና የተመረመሩ ናቸው",
          emergency_sos: "የአደጋ ጊዜ SOS",
          emergency_sos_desc: "24/7 የአደጋ ጊዜ ድጋፍ",
          share_trip: "ጉዞ አጋራ",
          share_trip_desc: "ጉዞዎን ከወዳጆችዎ ጋር ያጋሩ",
          support_24_7: "24/7 ድጋፍ",
          support_24_7_desc: "ሁልጊዜ እርስዎን ለመርዳት እዚህ ነን",
          continue_to_payment: "ወደ ክፍያ ይቀጥሉ",
          
          // Payment Method
          payment_method_title: "የክፍያ ዘዴ",
          payment_method_subtitle: "እንዴት መክፈል እንደሚፈልጉ ይምረጡ",
          payment_cash: "ጥሬ ገንዘብ",
          payment_cash_desc: "በቀጥታ ለአሽከርካሪው ይክፈሉ",
          payment_cbe: "የኢትዮጵያ ንግድ ባንክ",
          payment_cbe_desc: "ደህንነቱ የተጠበቀ የባንክ ዝውውር",
          payment_awash: "አዋሽ ባንክ",
          payment_awash_desc: "ፈጣን የክፍያ ሂደት",
          payment_abyssinia: "አቢሲኒያ ባንክ",
          payment_abyssinia_desc: "ፈጣን እና ደህንነቱ የተጠበቀ",
          payment_dashen: "ዳሽን ባንክ",
          payment_dashen_desc: "አስተማማኝ የባንክ አጋር",
          
          // Wallet
          ridefair_wallet: "ራይድፌር ዋሌት",
          pay_from_wallet: "ከዋሌት ይክፈሉ",
          current_balance: "የአሁኑ ሂሳብ",
          payment_amount: "የክፍያ መጠን",
          balance_after_payment: "ከክፍያ በኋላ ሂሳብ",
          confirm_wallet_payment: "የዋሌት ክፍያ አረጋግጥ",
          wallet_secure_note: "ክፍያዎ ደህንነቱ የተጠበቀ እና የተመሰጠረ ነው",
          insufficient_balance: "በቂ ሂሳብ የለም",
          payment_confirmed: "ክፍያ ተረጋግጧል",
          review_booking: "ቦታ ማስያዝ ይገምግሙ",
          
          // Booking Summary
          booking_summary_title: "የቦታ ማስያዝ ማጠቃለያ",
          booking_summary_subtitle: "ከማረጋገጥዎ በፊት የጉዞ ዝርዝሮችዎን ይገምግሙ",
          trip_details: "የጉዞ ዝርዝሮች",
          pickup: "ማንሳት:",
          destination_label: "መድረሻ:",
          notes: "ማስታወሻዎች:",
          none: "የለም",
          vehicle_details: "የተሽከርካሪ ዝርዝሮች",
          vehicle_type: "የተሽከርካሪ አይነት:",
          price_range: "የዋጋ ክልል:",
          payment_details: "የክፍያ ዝርዝሮች",
          agreed_price: "የተስማማ ዋጋ:",
          payment_method: "የክፍያ ዘዴ:",
          wallet_payment: "የዋሌት ክፍያ:",
          yes: "አዎ",
          no: "አይ",
          total_fare: "ጠቅላላ ዋጋ",
          terms_agreement: "የአገልግሎት ውሎችን እስማማለሁ እና ዋጋዎች ሊደራደሩ እንደሚችሉ እና በትራፊክ ሁኔታዎች ሊለያዩ እንደሚችሉ ተረድቻለሁ።",
          terms_of_service: "የአገልግሎት ውሎች",
          back: "ተመለስ",
          confirm_booking: "ቦታ ማስያዝ አረጋግጥ",
          
          // Confirmation Modal
          ride_booked_success: "ጉዞ በተሳካ ሁኔታ ተይዟል!",
          booking_confirmed_message: "ጉዞዎ ተረጋግጧል! አሽከርካሪ በቅርቡ ይደርሳል።",
          safety_priority_message: "የእርስዎ ደህንነት ቅድሚያችን ነው። ለተጨማሪ ደህንነት የጉዞ ዝርዝሮችዎን ከጓደኞችዎ ወይም ከቤተሰብዎ ጋር ያጋሩ።",
          estimated_arrival: "የተገመተ መድረሻ:",
          minutes: "ደቂቃዎች",
          back_to_home: "ወደ መግቢያ ተመለስ",
          view_trip_details: "የጉዞ ዝርዝሮች ይመልከቱ",
          
          // Mobile Footer
          continue_to_vehicle_mobile: "ወደ ተሽከርካሪ ይቀጥሉ",
          continue_to_price_mobile: "ወደ ዋጋ ይቀጥሉ",
          continue_to_payment_mobile: "ወደ ክፍያ ይቀጥሉ",
          review_booking_mobile: "ቦታ ማስያዝ ይገምግሙ",
          confirm_booking_mobile: "ቦታ ማስያዝ አረጋግጥ",

          // About Page
          about_page_title: "ስለ እኛ - ራይድፌር",
          about_page_subtitle: "በፍትሃዊነት፣ ግልጽነት እና ምርጫ ሞቢሊቲን እንደገና መፍጠር።",
          mission_title_1: "የእኛ",
          mission_title_2: "ተልእኮ",
          mission_desc_1: "የእኛ ተልእኮ ተጓዦች እና አሽከርካሪዎች በፍትሃዊነት፣ በግልጽነት እና በነጻነት የሚገናኙበት - ያለ አልጎሪዝም የዋጋ ማጭበርበር የሞቢሊቲ መድረክ መፍጠር ነው።",
          mission_desc_2: "ትራንስፖርቴሽን ተሳፋሪዎችንም ሆነ አሽከርካሪዎችን ማብቃት እንዳለበት እናምናለን። ለዚህም ነው ተጓዦች የራሳቸውን ዋጋ የሚያስቀምጡበት፣ አሽከርካሪዎች የሚፈልጉትን ጉዞ የሚመርጡበት እና ሁለቱም ወገኖች በእያንዳንዱ ግብይት ላይ ሙሉ ግልጽነት ያላቸውን ስርዓት የገነባነው።",
          mission_highlight_1: "ምንም የተደበቁ ዋጋ መጨመሮች የሌሉት ፍትሃዊ ዋጋ",
          mission_highlight_2: "የአሽከርካሪ ራስ ገዝነት እና ምርጫ",
          mission_highlight_3: "ግልጽ የጉዞ መረጃ",
          mission_card_title: "ፍትሃዊነት በቅድሚያ",
          mission_card_desc: "ፍትሃዊነትን በምናደርገው ሁሉ ማዕከል ላይ እናስቀምጣለን።",
          values_title_1: "ለምን",
          values_title_2: "እንኖራለን",
          values_subtitle: "የምናደርገውን እያንዳንዱ ውሳኔ የሚመሩ ዋና ዋና እሴቶች",
          value_1_title: "ፍትሃዊ ዋጋ",
          value_1_desc: "ተጓዦች እና አሽከርካሪዎች ሁለቱም ፍትሃዊ ዋጋ ይገባቸዋል፣ የተነፋ የዋጋ መጨመር ወይም የተደበቁ ክፍያዎች አይደለም።",
          value_2_title: "አሽከርካሪዎችን ማብቃት",
          value_2_desc: "አሽከርካሪዎች የሚቀበሉትን ጉዞ እና ውሎቻቸውን ለመምረጥ ሙሉ ራስ ገዝነት አላቸው።",
          value_3_title: "ደህንነቱ የተጠበቀ ሞቢሊቲ",
          value_3_desc: "የላቁ የደህንነት ባህሪያት፣ የማረጋገጫ ፍተሻዎች እና ለሁሉም ተጠቃሚዎች 24/7 ድጋፍ።",
          value_4_title: "ደንበኛ በቅድሚያ",
          value_4_desc: "እያንዳንዱ ውሳኔ ለተጓዦቻችን እና አሽከርካሪዎቻችን በሚሻል ነገር ይመራል።",
          presence_title_1: "ዓለም አቀፍ",
          presence_title_2: "መገኘት",
          presence_subtitle: "በዓለም ዙሪያ በሚሊዮኖች የሚቆጠሩ ሰዎች የሚታመን",
          stat_million_users: "ሚሊዮን ተጠቃሚዎች",
          stat_million_rides: "ሚሊዮን ጉዞዎች በቀን",
          difference_title_1: "ምን",
          difference_title_2: "ልዩ ያደርገናል",
          difference_1: "ተጓዦች የራሳቸውን ዋጋ ያስቀምጣሉ",
          difference_2: "አሽከርካሪዎች የሚፈልጉትን ጉዞ ይመርጣሉ",
          difference_3: "ደህንነት በቅድሚያ አቀራረብ",
          difference_4: "ምንም የዋጋ መጨመር ማጭበርበር የለም",
          difference_5: "ግልጽ የጉዞ መረጃ",
          difference_6: "ፍትሃዊ የአሽከርካሪ ኮሚሽን",
          team_title_1: "የእኛን",
          team_title_2: "ቡድኖች ይወቁ",
          team_subtitle: "የፍትሃዊ ሞቢሊቲ ወደፊት የሚገነቡ ራዕያዊ መሪዎች",
          testimonials_title_1: "ተጠቃሚዎች",
          testimonials_title_2: "ምን ይላሉ",
          testimonials_subtitle: "ከዓለም ዙሪያ ተጓዦች እና አሽከርካሪዎች እውነተኛ ታሪኮች",
          cta_title: "የፍትሃዊ ሞቢሊቲ ወደፊት ይቀላቀሉ",
          cta_subtitle: "በፍትሃዊነት፣ ግልጽነት እና ምርጫ ላይ የተገነባ የጉዞ መጋራት መድረክ ይለማመዱ።",
          cta_download_app: "አፕሊኬሽን ያውርዱ",
          footer_support: "ድጋፍ",
          footer_insurance: "ኢንሹራንስ",

          // Contact Page
          contact_page_title: "አግኙን እና ድጋፍ - ራይድፌር",
          contact_title_1: "አግኙን",
          contact_title_2: "እና ድጋፍ",
          contact_subtitle: "ለተጓዦች፣ አሽከርካሪዎች እና የንግድ አጋሮች 24/7 ፕሮፌሽናል እርዳታ",
          contact_stat_1: "24/7 ድጋፍ",
          contact_stat_2: "አማካይ ምላሽ: < 5 ደቂቃ",
          contact_stat_3: "ዓለም አቀፍ እርዳታ",
          contact_method_title: "የሚመርጡትን የመገናኛ ዘዴ ይምረጡ",
          contact_method_subtitle: "ወደ ልዩ የድጋፍ ቡድኖቻችን ለመድረስ በጣም ምቹ የሆነውን መንገድ ይምረጡ",
          contact_live_title: "ቀጥተኛ ድጋፍ",
          contact_live_desc: "በቻት ወይም ስልክ ፈጣን እርዳታ",
          contact_email_title: "የኢሜል ድጋፍ",
          contact_email_desc: "ከባለሙያ ምላሽ ጋር ዝርዝር ጥያቄዎች",
          contact_driver_title: "የአሽከርካሪ ድጋፍ",
          contact_driver_desc: "ለአሽከርካሪዎች ልዩ እርዳታ",
          contact_info_title: "ቀጥተኛ የመገናኛ መረጃ",
          contact_info_subtitle: "ለተለየ እርዳታ ወደ ልዩ ክፍሎች ይድረሱ",
          contact_customer_support: "የደንበኛ ድጋፍ",
          contact_business_enterprise: "ንግድ እና ኢንተርፕራይዝ",
          contact_safety_emergency: "ደህንነት እና አደጋ",
          contact_support_categories_title: "ፈጣን የድጋፍ ምድቦች",
          contact_support_categories_subtitle: "ለተለመዱ ጉዳዮች ፈጣን መፍትሄዎችን ያግኙ",
          contact_faq_title: "በተደጋጋሚ የሚጠየቁ ጥያቄዎች",
          contact_faq_subtitle: "ለተለመዱ ጥያቄዎች ፈጣን መልሶች",
          footer_tagline_contact: "በዓለም ዙሪያ ፕሮፌሽናል የትራንስፖርቴሽን መፍትሄዎች።",
          footer_support_title: "ድጋፍ",

          // Safety Page
          safety_page_title: "ደህንነት በቅድሚያ | ራይድፌር - ፕሪሚየም ሞቢሊቲ መድረክ",

          // Drivers Page
          drivers_page_title: "ከኛ ጋር ይንዱ - ራይድፌር",

          // Auth Page
          auth_page_title: "መግቢያ እና ተመዝግቦ መግባት - ራይድፌር",
          auth_hero_title_1: "የወደፊቱን",
          auth_hero_title_2: "ፍትሃዊ ሞቢሊቲ ይቀላቀሉ",
          auth_hero_subtitle: "ፕሪሚየም ጉዞዎችን፣ ግልጽ ዋጋን እና ሙሉ ቁጥጥርን ይለማመዱ። ተጓዦች እና አሽከርካሪዎች በፍትሃዊነት የሚገናኙበት።",
          auth_feature_1: "የባንክ ደረጃ ደህንነት",
          auth_feature_2: "ፈጣን መዳረሻ",
          auth_feature_3: "ዓለም አቀፍ አውታረ መረብ",
        },
      };
      this.initialize();
    }

    initialize() {
      // Load saved language preference
      const savedLang = localStorage.getItem("ridefair_language");
      if (savedLang && this.translations[savedLang]) {
        this.currentLang = savedLang;
      }

      // Apply current language on load
      this.updateLanguage();

      // Initialize language switcher UI
      this.initLanguageSwitcher();
    }

    initLanguageSwitcher() {
      const languageToggle = document.getElementById("languageToggle");
      const languageDropdown = document.getElementById("languageDropdown");
      const currentLangElement = document.getElementById("currentLang");
      const languageOptions = document.querySelectorAll(
        ".language-option, .mobile-language-option"
      );

      // Set initial language display
      currentLangElement.textContent = this.currentLang === "en" ? "EN" : "አማ";

      // Desktop dropdown toggle
      if (languageToggle) {
        languageToggle.addEventListener("click", (e) => {
          e.stopPropagation();
          languageDropdown.classList.toggle("active");
          languageToggle.classList.toggle("active");
        });

        // Close dropdown when clicking outside
        document.addEventListener("click", (e) => {
          if (
            !languageToggle.contains(e.target) &&
            !languageDropdown.contains(e.target)
          ) {
            languageDropdown.classList.remove("active");
            languageToggle.classList.remove("active");
          }
        });
      }

      // Language option selection
      languageOptions.forEach((option) => {
        option.addEventListener("click", () => {
          const lang = option.dataset.lang;
          if (lang && lang !== this.currentLang) {
            this.setLanguage(lang);

            // Update UI
            if (currentLangElement) {
              currentLangElement.textContent = lang === "en" ? "EN" : "አማ";
            }

            // Update active states
            languageOptions.forEach((opt) => {
              opt.classList.toggle("active", opt.dataset.lang === lang);
            });

            // Close dropdown on desktop
            if (languageDropdown) {
              languageDropdown.classList.remove("active");
            }
            if (languageToggle) {
              languageToggle.classList.remove("active");
            }
          }
        });
      });

      // Set initial active state
      languageOptions.forEach((option) => {
        option.classList.toggle(
          "active",
          option.dataset.lang === this.currentLang
        );
      });
    }

    setLanguage(lang) {
      if (this.translations[lang] && lang !== this.currentLang) {
        this.currentLang = lang;
        localStorage.setItem("ridefair_language", lang);
        this.updateLanguage();
      }
    }

    updateLanguage() {
      const elements = document.querySelectorAll("[data-key]");

      // Add transition effect
      document.body.classList.add("language-transition");

      elements.forEach((element) => {
        const key = element.dataset.key;
        if (
          this.translations[this.currentLang] &&
          this.translations[this.currentLang][key]
        ) {
          const text = this.translations[this.currentLang][key];

          // Handle different element types
          if (element.tagName === "INPUT" || element.tagName === "TEXTAREA") {
            element.placeholder = text;
          } else if (element.tagName === "OPTION") {
            element.textContent = text;
          } else {
            element.textContent = text;
          }
        }
      });

      // Update page direction for RTL languages (if needed)
      if (this.currentLang === "am") {
        document.documentElement.setAttribute("dir", "ltr"); // Amharic uses LTR
      } else {
        document.documentElement.removeAttribute("dir");
      }

      // Remove transition class after animation
      setTimeout(() => {
        document.body.classList.remove("language-transition");
      }, 400);
    }
  }

  // ============================================
  // DARK/LIGHT MODE TOGGLE FUNCTIONALITY
  // ============================================

  class ThemeManager {
    constructor() {
      this.themeToggle = document.getElementById("themeToggle");
      this.themeIcon = document.getElementById("themeIcon");
      this.currentTheme = "light"; // Default theme (changed to light)

      // Only initialize if elements exist
      if (this.themeToggle && this.themeIcon) {
        this.initialize();
      }
    }

    initialize() {
      // Load saved theme preference
      const savedTheme = localStorage.getItem("ridefair_theme");
      if (savedTheme) {
        this.currentTheme = savedTheme;
      }

      // Apply current theme on load
      this.applyTheme();

      // Initialize toggle button
      this.initToggle();
    }

    initToggle() {
      // Add click event listener
      if (this.themeToggle) {
        this.themeToggle.addEventListener("click", () => {
          this.toggleTheme();
        });
      }

      // Set initial icon
      this.updateIcon();
    }

    toggleTheme() {
      // Toggle between dark and light
      this.currentTheme = this.currentTheme === "dark" ? "light" : "dark";

      // Apply theme
      this.applyTheme();

      // Save preference
      localStorage.setItem("ridefair_theme", this.currentTheme);

      // Update icon
      this.updateIcon();

      // Add animation effect
      this.animateToggle();
    }

    applyTheme() {
      // Add or remove dark-mode class on body
      if (this.currentTheme === "dark") {
        document.body.classList.add("dark-mode");
      } else {
        document.body.classList.remove("dark-mode");
      }

      // Add smooth transition class
      document.body.classList.add("theme-transition");
      setTimeout(() => {
        document.body.classList.remove("theme-transition");
      }, 500);
    }

    updateIcon() {
      // Change icon based on current theme
      if (this.themeIcon && this.themeToggle) {
        if (this.currentTheme === "dark") {
          this.themeIcon.classList.remove("fa-sun");
          this.themeIcon.classList.add("fa-moon");
          this.themeToggle.setAttribute("aria-label", "Switch to light mode");
        } else {
          this.themeIcon.classList.remove("fa-moon");
          this.themeIcon.classList.add("fa-sun");
          this.themeToggle.setAttribute("aria-label", "Switch to dark mode");
        }
      }
    }

    animateToggle() {
      // Add bounce animation
      if (this.themeToggle && this.themeIcon) {
        this.themeToggle.style.transform = "scale(1.2)";
        this.themeIcon.style.transform = "rotate(180deg)";

        setTimeout(() => {
          this.themeToggle.style.transform = "";
          this.themeIcon.style.transform = "";
        }, 300);
      }
    }
  }

  // Initialize Language Manager
  const languageManager = new LanguageManager();

  // Initialize Theme Manager
  const themeManager = new ThemeManager();

  // ============================================
  // ORIGINAL FUNCTIONALITY (Keep all existing code below)
  // ============================================

  // Particle Canvas functionality
  const canvas = document.getElementById("particleCanvas");
  const heroSection = document.querySelector(".hero");

  if (canvas) {
    // ... existing particle canvas code remains exactly the same ...
    const ctx = canvas.getContext("2d");

    // Set canvas size to match hero section
    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = heroSection.offsetHeight;
    }

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Particle class
    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
        this.opacity = Math.random() * 0.5 + 0.3;
        this.color = Math.random() > 0.5 ? "#C1F11D" : "#a8d600";
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Bounce off edges
        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;

        // Keep in bounds
        this.x = Math.max(0, Math.min(canvas.width, this.x));
        this.y = Math.max(0, Math.min(canvas.height, this.y));
      }

      draw() {
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.opacity;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    }

    // Create particles
    const particles = [];
    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    // Animation loop for particles
    function animateParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        particle.update();
        particle.draw();
      });

      requestAnimationFrame(animateParticles);
    }

    animateParticles();
  }

  // ============================================
  // 1. HEADER SCROLL EFFECT
  // ============================================
  const header = document.querySelector(".header");
  let lastScrollTop = 0;

  window.addEventListener("scroll", () => {
    const scrollTop = window.scrollY;

    if (scrollTop > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }

    lastScrollTop = scrollTop;
  });

  // ============================================
  // 2. MOBILE MENU TOGGLE
  // ============================================
  const mobileMenuToggle = document.getElementById("mobileMenuToggle");
  const mobileMenu = document.getElementById("mobileMenu");
  const mobileMenuClose = document.getElementById("mobileMenuClose");

  mobileMenuToggle.addEventListener("click", () => {
    mobileMenu.classList.toggle("active");
    mobileMenuToggle.classList.toggle("active");
    document.body.style.overflow = mobileMenu.classList.contains("active")
      ? "hidden"
      : "auto";
  });

  mobileMenuClose.addEventListener("click", () => {
    mobileMenu.classList.remove("active");
    mobileMenuToggle.classList.remove("active");
    document.body.style.overflow = "auto";
  });

  // Close mobile menu when clicking outside
  mobileMenu.addEventListener("click", (e) => {
    if (e.target === mobileMenu) {
      mobileMenu.classList.remove("active");
      mobileMenuToggle.classList.remove("active");
      document.body.style.overflow = "auto";
    }
  });

  // Close mobile menu when clicking a link
  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mobileMenu.classList.remove("active");
      mobileMenuToggle.classList.remove("active");
      document.body.style.overflow = "auto";
    });
  });

  // ============================================
  // 3. DRIVER MODAL MANAGEMENT
  // ============================================
  const driverModal = document.getElementById("driverModal");
  const modalClose = document.getElementById("modalClose");
  const driverForm = document.getElementById("driverForm");

  // Make "Become a Driver" buttons navigate to the drivers page instead
  document
    .querySelectorAll(".btn-driver, .btn-driver-modal")
    .forEach((button) => {
      button.addEventListener("click", (e) => {
        e.preventDefault();
        // Navigate to drivers page — keeps behavior consistent across pages
        window.location.href = "drivers.html";
      });
    });

  // Close modal
  modalClose.addEventListener("click", () => {
    driverModal.classList.remove("active");
    document.body.style.overflow = "auto";
  });

  // Close modal when clicking outside
  driverModal.addEventListener("click", (e) => {
    if (e.target === driverModal) {
      driverModal.classList.remove("active");
      document.body.style.overflow = "auto";
    }
  });

  // Form submission with validation
  driverForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const inputs = driverForm.querySelectorAll("input, select");
    let isValid = true;

    inputs.forEach((input) => {
      if (!input.value.trim()) {
        isValid = false;
        input.style.borderColor = "#FF4B4B";
        input.style.boxShadow = "0 0 0 3px rgba(255, 75, 75, 0.1)";
      } else {
        input.style.borderColor = "#E5E7EB";
        input.style.boxShadow = "none";
      }
    });

    if (isValid) {
      alert(
        "Thank you for your application! We will contact you within 24 hours."
      );
      driverForm.reset();
      driverModal.classList.remove("active");
      document.body.style.overflow = "auto";
    }
  });

  // ============================================
  // 4. SAFETY TABS
  // ============================================
  const safetyOptions = document.querySelectorAll(".safety-option");

  safetyOptions.forEach((option) => {
    option.addEventListener("click", function () {
      safetyOptions.forEach((opt) => opt.classList.remove("active"));
      this.classList.add("active");
    });
  });

  // ============================================
  // 5. CITY MARKERS ANIMATION
  // ============================================
  const cityMarkers = document.querySelectorAll(".city-marker");

  cityMarkers.forEach((marker) => {
    marker.addEventListener("mouseenter", function () {
      const label = this.querySelector(".marker-label");
      if (label) {
        label.style.opacity = "1";
      }
    });

    marker.addEventListener("mouseleave", function () {
      const label = this.querySelector(".marker-label");
      if (label) {
        label.style.opacity = "0";
      }
    });

    marker.addEventListener("click", function () {
      const city = this.getAttribute("data-city");
      alert(
        `RideFair is available in ${city}! Download the app to get started.`
      );
    });
  });

  // ============================================
  // 6. ANIMATED COUNTERS
  // ============================================
  const statNumbers = document.querySelectorAll(".stat-number[data-count]");

  const animateCounter = (element) => {
    const target = Number.parseInt(element.getAttribute("data-count"));
    const isMillions = element.textContent.includes("M");
    let count = 0;
    const increment = target / 100;

    const timer = setInterval(() => {
      count += increment;
      if (count >= target) {
        element.textContent = target + (isMillions ? "M+" : "+");
        clearInterval(timer);
      } else {
        element.textContent = Math.floor(count) + (isMillions ? "M+" : "+");
      }
    }, 20);
  };

  // Start counter animation when element is in viewport
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  statNumbers.forEach((stat) => {
    observer.observe(stat);
  });

  // ============================================
  // 7. SCROLL REVEAL ANIMATIONS
  // ============================================
  const revealElements = document.querySelectorAll(
    ".reveal, .reveal-left, .reveal-right"
  );

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -100px 0px" }
  );

  revealElements.forEach((element) => {
    revealObserver.observe(element);
  });

  // ============================================
  // 8. SMOOTH SCROLLING FOR ANCHOR LINKS
  // ============================================
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href");

      if (href !== "#") {
        e.preventDefault();

        const targetId = href.substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
          mobileMenu.classList.remove("active");
          document.body.style.overflow = "auto";

          window.scrollTo({
            top: targetElement.offsetTop - 80,
            behavior: "smooth",
          });
        }
      }
    });
  });

  // ============================================
  // 9. SET CURRENT YEAR IN FOOTER
  // ============================================
  const currentYear = new Date().getFullYear();
  const yearElement = document.getElementById("currentYear");
  if (yearElement) {
    yearElement.textContent = currentYear;
  }

  // ============================================
  // 10. CREATE HERO PHONE UI
  // ============================================
  const phoneScreen = document.querySelector(".hero .phone-screen");
  if (phoneScreen) {
    // HTML is already in index.html, just add functionality
  }

  // Make select buttons functional
  const selectButtons = document.querySelectorAll(".driver-select-btn");
  selectButtons.forEach((button) => {
    button.addEventListener("click", () => {
      alert("Driver selected! Proceeding to booking...");
    });
  });

  // Make fare slider functional
  const fareSlider = document.getElementById("fareSlider");
  const fareThumb = document.getElementById("fareThumb");
  const fareProgress = document.getElementById("fareProgress");
  const fareAmount = document.getElementById("fareAmount");

  if (fareSlider && fareThumb && fareProgress && fareAmount) {
    let isDragging = false;

    const updateFare = (position) => {
      const percentage = Math.max(0, Math.min(100, position));
      fareThumb.style.left = percentage + "%";
      fareProgress.style.width = percentage + "%";
      const price = (5 + (percentage / 100) * 20).toFixed(2);
      fareAmount.textContent = price;
    };

    fareThumb.addEventListener("mousedown", (e) => {
      isDragging = true;
      fareThumb.style.cursor = "grabbing";
      e.preventDefault();
    });

    document.addEventListener("mousemove", (e) => {
      if (!isDragging) return;
      const rect = fareSlider.getBoundingClientRect();
      const position = ((e.clientX - rect.left) / rect.width) * 100;
      updateFare(position);
    });

    document.addEventListener("mouseup", () => {
      if (isDragging) {
        isDragging = false;
        fareThumb.style.cursor = "grab";
      }
    });

    fareSlider.addEventListener("click", (e) => {
      const rect = fareSlider.getBoundingClientRect();
      const position = ((e.clientX - rect.left) / rect.width) * 100;
      updateFare(position);
    });
  }

  console.log(
    "✨ RideFair website loaded successfully with enhanced particles, bold headers, and language switcher!"
  );
});
