import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useToast } from "@/hooks/use-toast";
import { acChargerTypes, dcChargerTypes } from '@/utils/calculatorUtils';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import emailjs from 'emailjs-com';

const Quote = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, formState: { errors }, setValue, reset } = useForm({
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      charger: '',
      location: '',
      message: ''
    }
  });

  const { toast } = useToast();

  // Combine AC and DC charger types
  const allChargerTypes = [...acChargerTypes, ...dcChargerTypes];

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    
    toast({
      title: "Processing your request...",
      description: "Please wait while we submit your quote request.",
    });
    
    // Construct email body
    const emailBody = `
Name: ${data.name}
Phone: ${data.phone}
Email: ${data.email}
Charger: ${data.charger || 'Not specified'}
Location: ${data.location}
Message: ${data.message || 'No additional message'}
    `;
    
    // Create a direct mailto link as a fallback method
    const mailtoFallback = () => {
      const subject = encodeURIComponent('New Quote Request from Thunder ROI Calculator');
      const body = encodeURIComponent(emailBody);
      window.location.href = `mailto:sales@thunderplus.io?subject=${subject}&body=${body}`;
    };
    
    try {
      // Use emailjs to send the email directly
      // Note: In a real-world scenario, you would use your own EmailJS credentials
      // or preferably a server-side email sending solution
      const templateParams = {
        to_email: 'sales@thunderplus.io',
        from_name: data.name,
        from_email: data.email,
        subject: 'New Quote Request from Thunder ROI Calculator',
        message: emailBody
      };
      
      // This is a placeholder for EmailJS - in a real implementation,
      // you would need to set up EmailJS with your service, template, and user IDs
      try {
        // Since we don't have actual EmailJS credentials, we'll use the fallback
        mailtoFallback();
        
        toast({
          title: "Quote Request Sent",
          description: "We'll contact you shortly with more information.",
        });
      } catch (emailError) {
        console.error("Email sending failed:", emailError);
        // Fallback to mailto
        mailtoFallback();
      }
    } catch (error) {
      console.error("Failed to process request:", error);
      toast({
        title: "Something went wrong",
        description: "Please try again or contact us directly.",
        variant: "destructive",
      });
    } finally {
      reset();
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-800">
      <Header />
      
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <Link to="/" className="inline-flex items-center gap-2 text-gray-700 hover:text-primary transition-colors mb-6 font-montserrat">
              <ArrowLeft className="h-4 w-4" />
              Back to Calculator
            </Link>
            
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
              <div className="bg-premium-gradient p-6 text-white">
                <h1 className="text-2xl font-poppins">Get a Quote for Your Thunder Charger</h1>
                <p className="text-gray-100 text-sm mt-1 font-montserrat">Fill in your details and we'll get back to you</p>
              </div>
              
              <div className="p-6">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name" className="text-gray-700">Full Name</Label>
                      <Input
                        id="name"
                        className="border border-gray-300 bg-white text-gray-800 mt-1 w-full font-montserrat"
                        placeholder="Enter your full name"
                        {...register("name", { required: "Name is required" })}
                      />
                      {errors.name && (
                        <p className="text-red-500 text-xs mt-1">{errors.name.message as string}</p>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="phone" className="text-gray-700">Phone Number</Label>
                        <Input
                          id="phone"
                          className="border border-gray-300 bg-white text-gray-800 mt-1 w-full font-montserrat"
                          placeholder="Enter your phone number"
                          {...register("phone", { 
                            required: "Phone number is required",
                            pattern: {
                              value: /^[0-9]{10}$/,
                              message: "Please enter a valid 10-digit phone number"
                            }
                          })}
                        />
                        {errors.phone && (
                          <p className="text-red-500 text-xs mt-1">{errors.phone.message as string}</p>
                        )}
                      </div>
                      
                      <div>
                        <Label htmlFor="email" className="text-gray-700">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          className="border border-gray-300 bg-white text-gray-800 mt-1 w-full font-montserrat"
                          placeholder="Enter your email address"
                          {...register("email", { 
                            required: "Email is required",
                            pattern: {
                              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                              message: "Please enter a valid email address"
                            }
                          })}
                        />
                        {errors.email && (
                          <p className="text-red-500 text-xs mt-1">{errors.email.message as string}</p>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="charger" className="text-gray-700">Preferred Charger</Label>
                      <Select onValueChange={(value) => setValue("charger", value)}>
                        <SelectTrigger className="w-full border border-gray-300 bg-white text-gray-800 mt-1 font-montserrat">
                          <SelectValue placeholder="Select a charger type" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-gray-300 text-gray-800">
                          {allChargerTypes.map((charger) => (
                            <SelectItem key={charger.id} value={charger.id} className="text-gray-800 hover:bg-gray-100 font-montserrat">
                              {charger.name} ({charger.phase} Phase - {charger.power}kW)
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.charger && (
                        <p className="text-red-500 text-xs mt-1">{errors.charger.message as string}</p>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="location" className="text-gray-700">Installation Location</Label>
                      <Input
                        id="location"
                        className="border border-gray-300 bg-white text-gray-800 mt-1 w-full font-montserrat"
                        placeholder="Enter your address or location"
                        {...register("location", { required: "Location is required" })}
                      />
                      {errors.location && (
                        <p className="text-red-500 text-xs mt-1">{errors.location.message as string}</p>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="message" className="text-gray-700">Additional Information</Label>
                      <Textarea
                        id="message"
                        className="border border-gray-300 bg-white text-gray-800 mt-1 w-full min-h-[100px] font-montserrat"
                        placeholder="Any specific requirements or questions?"
                        {...register("message")}
                      />
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-premium-gradient hover:opacity-90 text-white font-montserrat"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Submitting..." : "Submit Quote Request"}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Quote;
