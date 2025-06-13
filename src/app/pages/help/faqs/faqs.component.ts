import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface FAQ {
  question: string;
  answer: string;
  isOpen: boolean;
  category: string;
}

@Component({
  selector: 'app-faqs',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './faqs.component.html',
  styleUrls: ['./faqs.component.scss']
})
export class FaqsComponent {
  selectedCategory: string = 'all';
  searchQuery: string = '';

  categories = [
    { id: 'all', name: 'All FAQs' },
    { id: 'tracking', name: 'Tracking Basics' },
    { id: 'status', name: 'Status Updates' },
    { id: 'delivery', name: 'Delivery Issues' },
    { id: 'account', name: 'Account & Settings' },
    { id: 'technical', name: 'Technical Help' }
  ];

  faqs: FAQ[] = [
    {
      question: 'How do I track my package?',
      answer: 'Enter your tracking number in the search box on our homepage or in the quick track section. You can also track through our mobile app or by email notifications if you\'ve set those up.',
      isOpen: false,
      category: 'tracking'
    },
    {
      question: 'What do the different tracking statuses mean?',
      answer: 'Common statuses include: "In Transit" (package is moving), "Out for Delivery" (will be delivered today), "Delivered" (package has arrived), and "Exception" (delivery issue). Check our status guide for more details.',
      isOpen: false,
      category: 'status'
    },
    {
      question: 'My tracking number isn\'t working, what should I do?',
      answer: 'First, verify the number is correct. Wait 24-48 hours after shipping as it may take time to appear in our system. If still not working, contact our support team.',
      isOpen: false,
      category: 'tracking'
    },
    {
      question: 'How often is tracking information updated?',
      answer: 'Tracking information is typically updated every 2-4 hours, but may vary depending on the shipping carrier and location. Enable notifications to get real-time updates.',
      isOpen: false,
      category: 'status'
    },
    {
      question: 'Can I track multiple packages at once?',
      answer: 'Yes! Use our bulk tracking tool to track up to 25 packages simultaneously. You can also create an account to save and manage multiple tracking numbers.',
      isOpen: false,
      category: 'tracking'
    },
    {
      question: 'What should I do if my package is delayed?',
      answer: 'Check the tracking details for any exception notices. Weather, customs, or local events may cause delays. If delayed more than 48 hours, contact the carrier or our support.',
      isOpen: false,
      category: 'delivery'
    },
    {
      question: 'How do I set up email notifications?',
      answer: 'Go to your account settings, select "Notification Preferences," and choose your preferred notification types. You can get updates for status changes, delivery attempts, and more.',
      isOpen: false,
      category: 'account'
    },
    {
      question: 'Is there a mobile app available?',
      answer: 'Yes! Our mobile app is available for both iOS and Android devices. Download from the App Store or Google Play Store for on-the-go tracking.',
      isOpen: false,
      category: 'technical'
    }
  ];

  toggleFAQ(faq: FAQ) {
    faq.isOpen = !faq.isOpen;
  }

  filterFAQs() {
    return this.faqs.filter(faq => {
      const matchesCategory = this.selectedCategory === 'all' || faq.category === this.selectedCategory;
      const matchesSearch = !this.searchQuery || 
        faq.question.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(this.searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }

  selectCategory(categoryId: string) {
    this.selectedCategory = categoryId;
  }

  filterFaqs(): void {
    // Implement FAQ filtering logic
    console.log('Filtering FAQs with:', this.searchQuery);
  }
} 